"use strict";
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum: [admin, staff, evaluator]
 *               fullName:
 *                 type: string
 *                 required: false
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request (validation error or user exists)
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized (invalid credentials)
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 5f8d0d55b54764421b7156da
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         role:
 *           type: string
 *           enum: [admin, staff, evaluator]
 *         fullName:
 *           type: string
 *           example: John Doe
 *         department:
 *           type: string
 *           example: Computer Science
 *         positionType:
 *           type: string
 *           example: Professor
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
/**
 * @swagger
 * /auth/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search by username, email, or full name
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, staff, evaluator]
 *         description: Filter by role
 *     responses:
 *       200:
 *         description: List of users
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
 *                     $ref: '#/components/schemas/User'
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
 *         description: Forbidden (Admin access required)
 */
/**
 * @swagger
 * /auth/users/{id}:
 *   patch:
 *     summary: Update user details (admin or self)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *                 description: Profile photo image file (JPEG/PNG, max 2MB)
 *               fullName:
 *                 type: string
 *                 example: Usmael Abdi
 *               phone:
 *                 type: string
 *                 example: "+251987654321"
 *               address:
 *                 type: string
 *                 example: "Addis Ababa, Ethiopia"
 *               department:
 *                 type: string
 *                 example: "Software"
 *               positionType:
 *                 type: string
 *                 example: "Lead Engineer"
 *               bio:
 *                 type: string
 *                 example: "Full-stack developer with 5+ years of experience."
 *               website:
 *                 type: string
 *                 example: "https://usmael.live"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 description: Admin only field
 *               role:
 *                 type: string
 *                 enum: [admin, staff, evaluator]
 *                 description: Admin only field
 *               education:
 *                 type: array
 *                 description: Optional - provide one or more education records
 *                 items:
 *                   type: object
 *                   properties:
 *                     institution:
 *                       type: string
 *                       example: "Addis Ababa University"
 *                     degree:
 *                       type: string
 *                       example: "BSc in Software Engineering"
 *                     fieldOfStudy:
 *                       type: string
 *                       example: "Computer Science"
 *                     startYear:
 *                       type: number
 *                       example: 2018
 *                     endYear:
 *                       type: number
 *                       example: 2022
 *                     description:
 *                       type: string
 *                       example: "Graduated with honors."
 *               experience:
 *                 type: array
 *                 description: Optional - provide one or more experience records
 *                 items:
 *                   type: object
 *                   properties:
 *                     company:
 *                       type: string
 *                       example: "Creavers Service plc"
 *                     position:
 *                       type: string
 *                       example: "Full Stack Developer"
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2022-01-01"
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-12-31"
 *                     current:
 *                       type: boolean
 *                       example: false
 *                     description:
 *                       type: string
 *                       example: "Worked on various MERN stack projects."
 *               skills:
 *                 type: array
 *                 description: Optional - provide a list of skills
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "JavaScript"
 *                     level:
 *                       type: string
 *                       enum: [beginner, intermediate, advanced, expert]
 *                       example: "advanced"
 *               socialMedia:
 *                 type: object
 *                 description: Optional - provide social media links
 *                 properties:
 *                   linkedIn:
 *                     type: string
 *                     example: "https://linkedin.com/in/usmael"
 *                   twitter:
 *                     type: string
 *                     example: "https://twitter.com/usmael"
 *                   github:
 *                     type: string
 *                     example: "https://github.com/usmael"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: |
 *           Possible errors:
 *           - Validation error
 *           - Invalid file type
 *           - File too large
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: |
 *           Forbidden when:
 *           - Non-admin tries to update another user's profile
 *           - Non-admin tries to change role/status
 *       404:
 *         description: User not found
 *       413:
 *         description: File too large (max 2MB)
 */
/**
 * @swagger
 * /auth/profile:
 *   patch:
 *     summary: Update own profile (simplified)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePhoto:
 *                 type: string
 *                 format: binary
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               bio:
 *                 type: string
 *               website:
 *                 type: string
 *               education:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Education'
 *               experience:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Experience'
 *               skills:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Skill'
 *               socialMedia:
 *                 $ref: '#/components/schemas/SocialMedia'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /auth/users/{id}:
 *   delete:
 *     summary: Deactivate user (Soft delete)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Not authorized to delete)
 *       404:
 *         description: User not found
 */
/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 minLength: 8
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized (Invalid current password)
 *       404:
 *         description: User not found
 */
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset email sent successfully
 *       404:
 *         description: User not found with this email
 *       500:
 *         description: Error sending email
 */
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetToken
 *               - newPassword
 *             properties:
 *               resetToken:
 *                 type: string
 *                 description: The reset token received in email
 *                 example: abc123def456ghi789jkl
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: newSecurePassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
