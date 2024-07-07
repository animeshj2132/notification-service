/* eslint-disable func-names */
import Notification from '../models/notificationModel.js';
import { isValidUUID } from '../middleware/validation.js';
import userModel from '../models/userModel.js';

export const createNotification = async function (req, res) {
  try {
    const { userId, message } = req.body;

    if (!isValidUUID(userId)) {
      console.log('Invalid UUID:', userId);
      return res.status(400).send({ status: false, message: 'Invalid user ID' });
    }
    const user = await userModel.findOne({ id: userId });
    if (!user) {
      return res.status(404).send({ status: false, message: 'User ID does not exist' });
    }

    if (!message) {
      return res.status(400).send({ status: false, message: 'Message is required' });
    }

    const newNotification = await Notification.create({ userId: user.id, message });
    console.log('Notification created:', newNotification);
    delete newNotification._id;
    return res.status(201).send({ status: true, message: 'Notification created successfully', data: newNotification });
  } catch (error) {
    console.log('Error:', error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

export const getNotifications = async function (req, res) {
  try {
    const { userId } = req.params;

    if (!isValidUUID(userId)) {
      return res.status(400).send({ status: false, message: 'Invalid user ID' });
    }

    const notifications = await Notification.find({ userId });
    return res.status(200).send({ status: true, data: notifications });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

export const getNotificationById = async function (req, res) {
  try {
    const { userId, id } = req.params;

    if (!isValidUUID(userId) || !isValidUUID(id)) {
      return res.status(400).send({ status: false, message: 'Invalid user ID or notification ID' });
    }

    const notification = await Notification.findOne({ userId, id });
    if (!notification) {
      return res.status(404).send({ status: false, message: 'Notification not found' });
    }

    return res.status(200).send({ status: true, data: notification });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

export const markNotificationAsRead = async function (req, res) {
  try {
    const { userId, id } = req.params;

    if (!isValidUUID(userId) || !isValidUUID(id)) {
      return res.status(400).send({ status: false, message: 'Invalid user ID or notification ID' });
    }

    const notification = await Notification.findOneAndUpdate(
      { userId, id },
      { read: true },
      { new: true },
    );
    if (!notification) {
      return res.status(404).send({ status: false, message: 'Notification not found' });
    }

    return res.status(200).send({ status: true, message: 'Notification marked as read', data: notification });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
