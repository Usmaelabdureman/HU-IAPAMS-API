"use strict";
/**
 * @swagger
 * tags:
 *   name: Positions
 *   description: Academic position management
 */
/**
 * @swagger
 * /positions:
 *   post:
 *     summary: Create a new academic position
 *     tags: [Positions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - department
 *               - positionType
 *               - requirements
 *               - deadline
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               department:
 *                 type: string
 *                 enum: [Computer Science, Electrical Engineering, Mechanical Engineering, Civil Engineering, Mathematics, Physics, Chemistry, Biology, Business Administration, Economics]
 *               positionType:
 *                 type: string
 *                 enum: [Department Head, Dean, Professor, Associate Professor, Assistant Professor, Lecturer, Research Coordinator, Committee Member]
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Position created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /positions:
 *   get:
 *     summary: Get all positions
 *     tags: [Positions]
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term for title or description
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter by department
 *       - in: query
 *         name: positionType
 *         schema:
 *           type: string
 *         description: Filter by position type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, closed, filled]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Positions retrieved successfully
 */
/**
 * @swagger
 * /positions/{id}:
 *   get:
 *     summary: Get a position by ID
 *     tags: [Positions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Position retrieved successfully
 *       404:
 *         description: Position not found
 */
/**
 * @swagger
 * /positions/{id}:
 *   patch:
 *     summary: Update a position
 *     tags: [Positions]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               department:
 *                 type: string
 *               positionType:
 *                 type: string
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [open, closed, filled]
 *     responses:
 *       200:
 *         description: Position updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Position not found
 */
/**
 * @swagger
 * /positions/{id}/close:
 *   patch:
 *     summary: Close a position
 *     tags: [Positions]
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
 *         description: Position closed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Position not found
 */ 
