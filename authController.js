import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

import { User } from './models/User.js';
import { Role } from './models/Role.js';
import { secret } from './config.js';

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Registration error', errors });
      }
      const { username, password } = req.body;

      // find user
      const candidate = await User.findOne({ username });

      // if exists return error
      if (candidate) {
        return res.status(400).json({ message: 'User Exists' });
      }

      // if cannt find user: hash password
      const hashPassword = bcrypt.hashSync(password, 7);

      // find role
      //   const userRole = await Role.findOne({ value: 'Admin' });
      const userRole = await Role.findOne({ value: 'USER' });

      // create user
      const user = new User({ username, password: hashPassword, roles: [userRole.value] });

      // save user
      await user.save();
      return res.json({
        message: 'User Successfully Registered',
      });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: 'Registration error' });
    }
  }

  async login(req, res) {
    try {
      // get user and password from req body
      const { username, password } = req.body;

      // find username in db
      const user = await User.findOne({ username });

      // if user absence return error message
      if (!user) {
        return res.status(400).json({ message: `Can not find User ${username}` });
      }

      // compare hashed and normal password
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Incorrect password' });
      }

      // generate jsonwebtoken
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: 'Login error' });
    }
  }

  async getUsers(req, res) {
    try {
      //   const userRole = new Role();
      //   const adminRole = new Role({ value: 'ADMIN' });
      //   await userRole.save();
      //   await adminRole.save();

      const users = await User.find();
      res.json(users);
    } catch (e) {
      console.error(e);
    }
  }
}

export default new authController();
