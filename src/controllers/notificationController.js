import notificationModel from '../models/notificationModel.js';
import { isValidUUID, isValid } from '../middleware/validation.js';
import userModel from '../models/userModel.js';
import { sendMessageToQueue } from '../rabbitmq.js';
import { getBroadcastFunction } from '../websocket.js';

export const createNotification = async function createNotification(req, res) {
  try {
    const { userId, message } = req.body;

    const requestedArray = Object.keys(req.body);
    if (requestedArray.length === 0) {
      return res.status(400).send({ status: false, msg: "Body can't be empty" });
    }

    const requiredFieldOfRequestArray = ['userId', 'message'];
    const missingFields = [];
    const valuesOfData = [userId, message];
    for (let i = 0; i < requiredFieldOfRequestArray.length; i += 1) {
      if (!isValid(valuesOfData[i])) missingFields.push(requiredFieldOfRequestArray[i]);
    }
    if (missingFields.length > 0) {
      return res.status(400).send({ status: false, msg: `${missingFields} is required` });
    }

    if (!isValidUUID(userId)) {
      console.log('Invalid UUID:', userId);
      return res.status(400).send({ status: false, message: 'Invalid user ID' });
    }

    const user = await userModel.findOne({ id: userId });
    if (!user) {
      return res.status(404).send({ status: false, message: 'User ID does not exist' });
    }

    const newNotification = await notificationModel.create({ userId: user.id, message });

    const { _id, __v, ...notificationData } = newNotification.toObject();

    console.log('Notification created:', notificationData);

    // Send message to RabbitMQ queue
    sendMessageToQueue(notificationData);

    // Broadcast the notification via WebSocket
    getBroadcastFunction(notificationData);

    return res.status(201).send({
      status: true,
      message: 'Notification created successfully',
      data: notificationData,
    });
  } catch (error) {
    console.log('Error:', error.message);
    return res.status(500).send({ status: false, message: error.message });
  }
};

export const getNotifications = async function getNotifications(req, res) {
  try {
    const { userId } = req.params;

    if (!isValidUUID(userId)) {
      return res.status(400).send({ status: false, message: 'Invalid user ID' });
    }

    const notifications = await notificationModel.find({ userId });
    return res.status(200).send({ status: true, data: notifications });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

export const getNotificationById = async function getNotificationById(req, res) {
  try {
    const { userId, id } = req.params;

    if (!isValidUUID(userId) || !isValidUUID(id)) {
      return res.status(400).send({ status: false, message: 'Invalid user ID or notification ID' });
    }

    const notification = await notificationModel.findOne({ userId, id });
    if (!notification) {
      return res.status(404).send({ status: false, message: 'Notification not found' });
    }

    return res.status(200).send({ status: true, data: notification });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

export const markNotificationAsRead = async function markNotificationAsRead(req, res) {
  try {
    const { userId, id } = req.params;

    if (!isValidUUID(userId) || !isValidUUID(id)) {
      return res.status(400).send({ status: false, message: 'Invalid user ID or notification ID' });
    }

    const notification = await notificationModel.findOneAndUpdate(
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
