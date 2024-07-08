import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';
import {
  isValid, isValidEmail, isValidPassword, isValidUsername,
} from '../middleware/validation.js';

dotenv.config();

export async function createUser(req, res) {
  try {
    const data = req.body;
    const { username, email, password } = data;

    const requestedArray = Object.keys(data);
    if (requestedArray.length === 0) {
      return res.status(400).send({ status: false, msg: "Body can't be empty" });
    }

    const requiredFieldOfRequestArray = ['username', 'email', 'password'];
    const missingFields = [];
    const valuesOfData = [username, email, password];
    for (let i = 0; i < requiredFieldOfRequestArray.length; i += 1) {
      if (!isValid(valuesOfData[i])) missingFields.push(requiredFieldOfRequestArray[i]);
    }
    if (missingFields.length > 0) {
      return res.status(400).send({ status: false, msg: `${missingFields} is required` });
    }

    if (!isValidUsername(username)) {
      return res.status(400).send({ status: false, msg: 'username is not valid' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).send({ status: false, msg: 'email is not valid' });
    }

    if (password.length < 8 || password.length > 15) {
      return res.status(400).send({ status: false, msg: 'password must be at least 8 characters long and should be less than 15 characters' });
    }
    if (!isValidPassword(password)) {
      return res.status(400).send({ status: false, msg: 'enter valid password it should contain one capital letter and one special character(@#$%&*!)  ' });
    }
    const findEmail = await userModel.findOne({ email: email.trim() });
    if (findEmail) {
      return res.status(400).send({ status: false, msg: 'this Email is already in use' });
    }

    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    data.password = hash;
    let newUserData = await userModel.create(data);

    newUserData = newUserData.toObject();
    delete newUserData._id;
    delete newUserData.password;
    delete newUserData.__v;
    return res.status(201).send({ status: true, message: 'User created successfully', data: newUserData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ status: false, message: 'Email and Password are required' });
    }

    const existEmail = await userModel.findOne({ email: email.trim() });
    if (!existEmail) {
      return res.status(404).send({ status: false, message: 'email not found' });
    }

    const hash = existEmail.password;
    const compare = bcrypt.compareSync(password, hash);
    if (!compare) return res.status(401).send({ status: false, msg: 'Password Incorrect' });

    const token = jwt.sign(
      {
        id: existEmail.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    return res.status(200).send({ status: true, msg: 'login successful, token is valid for 1h', token });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}
