import { Application } from './Application.models';
import { IApplication, ApplicationStatus, Evaluation } from './Application.interfaces';
import httpStatus from 'http-status';
import ApiError from '../../error/ApiError';
import { supabase } from '../../utils/supabase';
import { Position } from '../Position/Position.models';
import mongoose, { Types } from 'mongoose';


const uploadFile = async (file: Express.Multer.File, userId: string, type: string) => {
  const fileExt = file.originalname.split('.').pop();
  const fileName = `${userId}-${Date.now()}-${type}.${fileExt}`;
  const filePath = `applications/${userId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('documents')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'File upload failed');
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('documents')
    .getPublicUrl(data.path);

  return publicUrl;
};

const applyToPosition = async (  applicationData: { position: string },
  files: {
    cv?: Express.Multer.File[];
    coverLetter?: Express.Multer.File[];
    certificates?: Express.Multer.File[];
  },
  userId: string
) => {
  const existingApplication = await Application.findOne({
    position: applicationData.position,
    applicant: userId
  })
  if (existingApplication) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already applied to this position');
  }

  if (!files?.cv?.[0]) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'CV is required');
  }
   // Upload files
   const cvUrl = await uploadFile(files.cv[0], userId, 'cv');
   let coverLetterUrl;
   let certificateUrls = [];
 
   if (files.coverLetter?.[0]) {
     coverLetterUrl = await uploadFile(files.coverLetter[0], userId, 'cover-letter');
   }
 
   if (files.certificates) {
     for (const cert of files.certificates) {
       const url = await uploadFile(cert, userId, 'certificate');
       certificateUrls.push(url);
     }
   }
 

  return Application.create({
    position: applicationData.position,
    applicant: userId,
    documents: {
      cv: cvUrl,
      coverLetter: coverLetterUrl,
      certificates: certificateUrls
    },
    status: ApplicationStatus.PENDING
  });
};



const getApplications = async (userId: string, role: string, filters: any) => {
  try {
    let query: any = {};

    // console.log(`Fetching applications for ${role} ${userId}`); // Debug

    if (role === 'staff') {
      query.applicant = new mongoose.Types.ObjectId(userId);
    } else if (role === 'evaluator') {
      const evaluatorId = new mongoose.Types.ObjectId(userId);
      
      // Debug: Check position assignments
      const assignedPositions = await Position.find(
        { evaluators: evaluatorId },
        { _id: 1 }
      );
      // console.log('Assigned positions:', assignedPositions);

      if (!assignedPositions.length) {
        // console.log('No positions assigned to evaluator');
        return [];
      }

      query.position = { 
        $in: assignedPositions.map(p => p._id) 
      };
      query.status = { $in: [ApplicationStatus.PENDING, ApplicationStatus.UNDER_REVIEW, ApplicationStatus.ACCEPTED,ApplicationStatus.REJECTED,ApplicationStatus.SHORTLISTED] };
    }

    if (filters.position) {
      query.position = new mongoose.Types.ObjectId(filters.position);
    }

    // console.log('Final query:', JSON.stringify(query)); // Debug

    const applications = await Application.find(query)
      .populate({
        path: 'position',
        select: 'title department evaluators',
        populate: {
          path: 'evaluators',
          select: 'username email'
        }
      })
      .populate('applicant', 'username email')
      .populate({
        path: 'evaluations.evaluator',
        select: 'username email'
      });

    // console.log('Found applications:', applications.length); // Debug
    return applications;
  } catch (error) {
    console.error('Error in getApplications:', error);
    throw error;
  }
};
const withdrawApplication = async (applicationId: string, userId: string) => {
  const application = await Application.findOneAndUpdate(
    { _id: applicationId, applicant: userId },
    { status: ApplicationStatus.WITHDRAWN },
    { new: true }
  );

  if (!application) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Application not found');
  }

  return application;
};



// export const submitEvaluation = async (
//   applicationId: string,
//   evaluatorId: string,
//   scores: { experience: number; education: number; skills: number },
//   comments: string
// ) => {
// // debug
// console.log('submitEvaluation called with:', {

//   applicationId,
//   evaluatorId,
//   scores,
//   comments
// });

//   // 1. Verify evaluator is assigned to this position
//   const application = await Application.findById(applicationId).populate('position');
//   if (!application) throw new ApiError(404, 'Application not found');

//   const position = await Position.findById(application.position);
//   if (!position?.evaluators?.includes(new mongoose.Types.ObjectId(evaluatorId))) {
//     throw new ApiError(403, 'Not authorized to evaluate this application');
//   }

//   // 2. Add/update evaluation
//   const evaluationIndex = application.evaluations.findIndex(
//     (e) => e?.evaluator!.toString() === evaluatorId
//   );

//   const evaluationData = {
//     evaluator: new mongoose.Types.ObjectId(evaluatorId),
//     scores,
//     comments,
//     submittedAt: new Date()
//   };

//   if (evaluationIndex === -1) {
//     application.evaluations.push(evaluationData);
//   } else {
//     application.evaluations[evaluationIndex].set(evaluationData);
//   }

//   // 3. Calculate average score
//   const avgScore = calculateAverageScore(application.evaluations);
//   application.averageScore = avgScore;

//   // 4. Auto-decide if all evaluators submitted
//   if (position.evaluators.length === application.evaluations.length) {
//     application.status = avgScore >= 7 ? ApplicationStatus.ACCEPTED : ApplicationStatus.REJECTED;
//   }

//   await application.save();
//   return application;
// };

// Helper function
const calculateAverageScore = (evaluations: any[]) => {
  if (evaluations.length === 0) return 0;
  const total = evaluations.reduce((sum, evaluation) => {
    return sum + (evaluation.scores.experience + evaluation.scores.education + evaluation.scores.skills) / 3;
  }, 0);
  return total / evaluations.length;
};

export const submitEvaluation = async (
  applicationId: string,
  evaluatorId: string,
  scores: { experience: number; education: number; skills: number },
  comments: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Get application with properly typed population
    const application = await Application.findById(applicationId)
      .populate<{ position: { evaluators: Types.ObjectId[] } }>({
        path: 'position',
        select: 'evaluators'
      })
      .session(session);

    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    // 2. Verify evaluator with proper typing
    const evaluatorObjectId = new Types.ObjectId(evaluatorId);
    const isEvaluator = application.position.evaluators.some(evaluator => 
      evaluator.equals(evaluatorObjectId)
    );

    if (!isEvaluator) {
      throw new ApiError(403, 'Not authorized to evaluate this application');
    }

    // 3. Update or add evaluation with proper typing
    const evaluationIndex = application.evaluations.findIndex(e => 
      e.evaluator && e.evaluator.equals(evaluatorObjectId)
    );

    const evaluationData: Evaluation = {
      evaluator: evaluatorObjectId,
      scores,
      comments,
      submittedAt: new Date()
    };

    if (evaluationIndex === -1) {
      application.evaluations.push(evaluationData);
    } else {
      application.evaluations[evaluationIndex].set(evaluationData);
    }

    // 4. Calculate average score
    application.averageScore = calculateAverageScore(application.evaluations);

    // 5. Check completion and update status
    const allEvaluatorIds = application.position.evaluators.map(e => e.toString());
    const evaluatedIds = application.evaluations.map(e => e.evaluator!.toString());
    
    const allEvaluated = allEvaluatorIds.some(id => evaluatedIds.includes(id));
    
    if (allEvaluated) {
      application.status = application.averageScore >= 7 ? 
        ApplicationStatus.ACCEPTED : 
        ApplicationStatus.REJECTED;
    }

    await application.save({ session });
    await session.commitTransaction();

    return application;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
export const ApplicationService = {
  applyToPosition,
  getApplications,
  withdrawApplication,
  uploadFile,
  submitEvaluation,
  calculateAverageScore
};