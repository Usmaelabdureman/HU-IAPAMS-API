// Auth.routes.ts
import { Router } from 'express';

import { auth } from '../../middlewares/auth';
import { AuthController } from './Auth.controllers';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/users', auth('admin'), AuthController.getAllUsers);
router.patch('/users/:id', auth(), AuthController.updateUser);
router.delete('/users/:id', auth(), AuthController.deleteUser);
router.patch('/change-password', auth(), AuthController.changePassword);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.get('/me', auth(), AuthController.getMe);

export const AuthRoutes = router;