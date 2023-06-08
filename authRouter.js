import { Router } from 'express';
import { check } from 'express-validator';

import controller from './authController.js';
import authMiddleware from './middleware/authMiddleware.js';
import roleMiddleware from './middleware/roleMiddleware.js';

const router = new Router();

router.post(
  '/registration',
  [
    check('username', 'Username can not be empty').notEmpty(),
    check('password', 'Password must be at least 6 characters long ').isLength({
      min: 4,
      max: 10,
    }),
  ],
  controller.registration,
);
router.post('/login', controller.login);
// router.get('/users', authMiddleware, controller.getUsers);
router.get('/users', roleMiddleware(['USER']), controller.getUsers);

export default router;
