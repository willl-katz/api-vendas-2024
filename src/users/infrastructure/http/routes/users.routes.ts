import { Router } from "express";
import { createUserController } from "../controllers/create-user.controller";
import { searchUserController } from "../controllers/search-user.controller";

const usersRouter = Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - passowrd
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id (uuid) of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         passowrd:
 *           type: string
 *           description: The passowrd of the user
 *         avatar:
 *           type: string
 *           description: The avatar of the user
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the user was added
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the user was last updated
 *       example:
 *         id: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *         name: Sample User
 *         email: sampleuser@mail.com
 *         password: $2a$06$tPOF8dcfc5sIvII3NTLQh.QF5sR4iBbgAihVn.l2M07WoDyD7b1Ge
 *         avatar: null
 *         created_at: 2023-01-01T10:00:00Z
 *         updated_at: 2023-01-01T10:00:00Z
 *     UserListResponse:
 *      type: object
 *      properties:
 *        items:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/User'
 *        total:
 *          type: number
 *          description: The total number of users
 *        current_page:
 *          type: integer
 *          description: Current page number
 *        last_page:
 *          type: integer
 *          description: Last page number
 *        per_page:
 *          type: integer
 *          description: Number of items per page
 *        example:
 *          items:
 *            id: 50c33caa-c854-4a6a-85e2-c506828df026
 *            name: Sample User
 *            email: sample@example.com
 *            password: $2a$06$Q7vz5z7z7z7z7z7z7z7z
 *            avatar: null
 *            created_at: 2023-01-01T10:00:00Z
 *            updated_at: 2023-01-01T10:00:00Z
 *         total: 15
 *         current_page: 1
 *         last_page: 10
 *         per_page: 15
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Input data not provided or invalid
 *       409:
 *         description: Email already used on another user
 */

usersRouter.post('/', createUserController)

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Search for users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *         description: The number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: The field to sort
 *       - in: query
 *         name: sort_dir
 *         schema:
 *           type: string
 *         description: The direction to sort
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: The filter to apply
 *     responses:
 *       200:
 *         description: The list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 */
usersRouter.get('/', searchUserController)

export { usersRouter }
