"use strict";
// /**
//  * @swagger
//  * tags:
//  *   - name: Applications
//  *     description: Job application management
//  */
// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Application:
//  *       type: object
//  *       required:
//  *         - positiona
//  *         - applicant
//  *         - documents
//  *       properties:
//  *         position:
//  *           type: string
//  *           example: 5f8d0d55b54764421b7156da
//  *         applicant:
//  *           type: string
//  *           example: 5f8d0d55b54764421b7156db
//  *         documents:
//  *           type: object
//  *           properties:
//  *             cv:
//  *               type: string
//  *               example: https://example.com/cv.pdf
//  *             coverLetter:
//  *               type: string
//  *               example: https://example.com/cover-letter.pdf
//  *             certificates:
//  *               type: array
//  *               items:
//  *                 type: string
//  *                 example: https://example.com/certificate.pdf
//  *         status:
//  *           type: string
//  *           enum: [pending, under_review, shortlisted, rejected, withdrawn]
//  *           example: pending
//  */
/**
 * @swagger
 * tags:
 *   - name: Applications
 *     description: Job application and evaluation management
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       properties:
 *         evaluations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               evaluator:
 *                 type: string
 *                 example: 5f8d0d55b54764421b7156dd
 *               scores:
 *                 type: object
 *                 properties:
 *                   experience:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 10
 *                     example: 8.5
 *                   education:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 10
 *                     example: 7.0
 *                   skills:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 10
 *                     example: 9.0
 *               comments:
 *                 type: string
 *                 example: "Strong candidate with relevant experience"
 *               evaluatedAt:
 *                 type: string
 *                 format: date-time
 *         averageScore:
 *           type: number
 *           example: 8.2
 *         finalDecision:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *           example: pending
 */
/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Submit new application with file uploads
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - position
 *               - cv
 *             properties:
 *               position:
 *                 type: string
 *                 description: ID of the position being applied for
 *                 example: 5f8d0d55b54764421b7156da
 *               cv:
 *                 type: string
 *                 format: binary
 *                 description: CV file (PDF/DOCX, max 5MB)
 *               coverLetter:
 *                 type: string
 *                 format: binary
 *                 description: Cover letter file (PDF/DOCX, max 5MB)
 *               certificates:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Certificate files (PDF/DOCX, max 5MB each, up to 10 files)
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid input or already applied
 *       401:
 *         description: Unauthorized
 *       413:
 *         description: File too large (max 5MB)
 *
 *
 *   get:
 *     summary: Get applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: Filter by position ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, under_review, shortlisted, rejected, withdrawn]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Application'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden access
 *
 * /applications/{id}/withdraw:
 *   patch:
 *     summary: Withdraw application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application withdrawn successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */
/**
 * @swagger
 * /applications/{id}/evaluate:
 *   post:
 *     summary: Submit evaluation for an application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scores
 *             properties:
 *               scores:
 *                 type: object
 *                 required:
 *                   - experience
 *                   - education
 *                   - skills
 *                 properties:
 *                   experience:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 10
 *                     example: 8
 *                   education:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 10
 *                     example: 7
 *                   skills:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 10
 *                     example: 9
 *               comments:
 *                 type: string
 *                 example: "Strong technical skills but lacks management experience"
 *     responses:
 *       200:
 *         description: Evaluation submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Invalid input or unauthorized evaluation
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not assigned as evaluator)
 *       404:
 *         description: Application not found
 *
 * /applications/{id}:
 *   get:
 *     summary: Get application details (including evaluations)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application details with evaluations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not applicant or evaluator)
 *       404:
 *         description: Application not found
 */ 
