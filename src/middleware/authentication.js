import jwt from 'jsonwebtoken';
import { isValidUUID } from './validation.js';
import userModel from '../models/userModel.js';

// eslint-disable-next-line consistent-return
async function authenticate(req, res, next) {
  try {
    const userId = req.params.userId ? req.params.userId.trim() : null;

    if (userId && !isValidUUID(userId)) {
      return res.status(400).send({ status: false, message: 'Invalid user ID' });
    }

    const token = req.headers.authorization;
    if (!token) {
      return res.status(400).send({ status: false, message: 'Token is required, please login' });
    }

    const newToken = token.replace('Bearer ', '');

    const decodedToken = jwt.verify(newToken, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).send({ status: false, message: 'Authentication failed' });
    }

    const userExists = await userModel.findOne({ id: decodedToken.id });
    if (!userExists) {
      return res.status(404).send({ status: false, message: 'User not found' });
    }

    if (userId && userId !== decodedToken.id) {
      return res.status(403).send({ status: false, message: 'Login user is not authorized' });
    }

    req.user = decodedToken; // Set the decoded token in the request object for further use
    next();
  } catch (error) {
    if (error.message === 'jwt expired') {
      return res.status(401).send({ status: false, message: 'Your token is expired' });
    }
    return res.status(500).send({ status: false, message: error.message });
  }
}

export default authenticate;
