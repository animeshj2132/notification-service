import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const userModel = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  connected: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model('User', userModel);
