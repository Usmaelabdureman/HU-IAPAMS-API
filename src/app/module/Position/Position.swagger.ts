/**
 * @swagger
 * tags:
 *   name: Positions
 *   description: Academic position management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Position:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - department
 *         - positionType
 *         - requirements
 *         - deadline
 *       properties:
 *         title:
 *           type: string
 *           example: "Professor of Computer Science"
 *         description:
 *           type: string
 *           example: "Tenured position for senior faculty member"
 *         department:
 *           type: string
 *           enum: [Computer Science, Electrical Engineering, Mechanical Engineering, Civil Engineering, Mathematics, Physics, Chemistry, Biology, Business Administration, Economics]
 *         positionType:
 *           type: string
 *           enum: [Department Head, Dean, Professor, Associate Professor, Assistant Professor, Lecturer, Research Coordinator, Committee Member]
 *         requirements:
 *           type: array
 *           items:
 *             type: string
 *           example: ["PhD in relevant field", "5+ years teaching experience"]
 *         deadline:
 *           type: string
 *           format: date-time
 *           example: "2024-12-31T23:59:59Z"
 *         status:
 *           type: string
 *           enum: [open, closed, filled]
 *           default: open
 */


/**
 * @swagger
 * /positions/create:
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
 *             $ref: '#/components/schemas/Position'
 *     responses:
 *       201:
 *         description: Position created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Position'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Admin access required
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
 *           enum: [Computer Science, Electrical Engineering, Mechanical Engineering, Civil Engineering, Mathematics, Physics, Chemistry, Biology, Business Administration, Economics]
 *         description: Filter by department
 *       - in: query
 *         name: positionType
 *         schema:
 *           type: string
 *           enum: [Department Head, Dean, Professor, Associate Professor, Assistant Professor, Lecturer, Research Coordinator, Committee Member]
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
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Positions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Position'
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
 *         description: Position ID
 *     responses:
 *       200:
 *         description: Position retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Position'
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
 *         description: Position ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Position'
 *     responses:
 *       200:
 *         description: Position updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Position'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Not authorized to update this position
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
 *         description: Position ID
 *     responses:
 *       200:
 *         description: Position closed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Position'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Not authorized to close this position
 *       404:
 *         description: Position not found
 */