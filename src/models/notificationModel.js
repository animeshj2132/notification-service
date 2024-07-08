import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const notificationModel = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model('Notification', notificationModel);
