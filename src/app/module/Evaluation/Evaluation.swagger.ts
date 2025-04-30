/**
 * @swagger
 * tags:
 *   - name: Evaluations
 *     description: Application evaluation management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Evaluation:
 *       type: object
 *       required:
 *         - application
 *         - evaluator
 *       properties:
 *         application:
 *           type: string
 *           example: 5f8d0d55b54764421b7156dc
 *         evaluator:
 *           type: string
 *           example: 5f8d0d55b54764421b7156dd
 *         scores:
 *           type: object
 *           properties:
 *             experience:
 *               type: number
 *               minimum: 0
 *               maximum: 10
 *               example: 8
 *             education:
 *               type: number
 *               example: 9
 *             skills:
 *               type: number
 *               example: 7
 *         comments:
 *           type: string
 *           example: Strong candidate with relevant experience
 *         decision:
 *           type: string
 *           enum: [recommended, not_recommended, pending]
 *           example: recommended
 */

/**
 * @swagger
 * /evaluations:
 *   post:
 *     summary: Create new evaluation
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               application:
 *                 type: string
 *             example:
 *               application: 5f8d0d55b54764421b7156dc
 *     responses:
 *       201:
 *         description: Evaluation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evaluation'
 *       400:
 *         description: Invalid input or duplicate evaluation
 *       401:
 *         description: Unauthorized
 *
 * /evaluations/{id}:
 *   patch:
 *     summary: Submit evaluation results
 *     tags: [Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scores:
 *                 type: object
 *                 properties:
 *                   experience:
 *                     type: number
 *                   education:
 *                     type: number
 *                   skills:
 *                     type: number
 *               comments:
 *                 type: string
 *               decision:
 *                 type: string
 *             example:
 *               scores:
 *                 experience: 8
 *                 education: 9
 *                 skills: 7
 *               comments: Strong technical skills
 *               decision: recommended
 *     responses:
 *       200:
 *         description: Evaluation submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evaluation'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Evaluation not found
 *
 * /evaluations/application/{id}:
 *   get:
 *     summary: Get evaluations for application
 *     tags: [Evaluations]
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
 *         description: Evaluations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evaluation'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Application not found
 */