import { Application } from './Application.models';
import { IApplication, ApplicationStatus } from './Application.interfaces';
import httpStatus from 'http-status';
import ApiError from '../../error/ApiError';
import { supabase } from '../../utils/supabase';


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
  let query: any = {};

  if (role === 'staff') {
    query.applicant = userId;
  } else if (role === 'evaluator') {
    query.status = ApplicationStatus.UNDER_REVIEW;
  }

  if (filters.position) {
    query.position = filters.position;
  }

  return Application.find(query)
    .populate('position', 'title department')
    .populate('applicant', 'username email');
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

export const ApplicationService = {
  applyToPosition,
  getApplications,
  withdrawApplication,
  uploadFile
};