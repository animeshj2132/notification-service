import express from 'express';
import {
  createNotification,
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
} from '../controllers/notificationController.js';
import authenticate from '../middleware/authentication.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification related endpoints
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', createNotification);

/**
 * @swagger
 * /api/notifications/{userId}:
 *   get:
 *     summary: Get a list of notifications for a user
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of notifications
 *       400:
 *         description: Invalid user ID
 *     security:
 *       - bearerAuth: []
 */
router.get('/:userId', authenticate, getNotifications);

/**
 * @swagger
 * /api/notifications/{userId}/{id}:
 *   get:
 *     summary: Get details of a specific notification
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification details
 *       400:
 *         description: Invalid user ID or notification ID
 *       404:
 *         description: Notification not found
 *     security:
 *       - bearerAuth: []
 */
router.get('/:userId/:id', authenticate, getNotificationById);

/**
 * @swagger
 * /api/notifications/{userId}/{id}:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       400:
 *         description: Invalid user ID or notification ID
 *       404:
 *         description: Notification not found
 *     security:
 *       - bearerAuth: []
 */
router.put('/:userId/:id', authenticate, markNotificationAsRead);

export default router;
