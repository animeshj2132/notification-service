import express from 'express';
import { createUser, login } from '../controllers/userController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Authentication related endpoints
 */

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post('/signup', createUser);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login and receive a JWT
 *     tags: [user]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Invalid input
 */
router.post('/login', login);

export default router;
