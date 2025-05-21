// Auth.routes.ts
import { Router } from 'express';

import { auth } from '../../middlewares/auth';
import { AuthController } from './Auth.controllers';
import { profilePhotoUpload } from '../../utils/multer';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/users', auth('admin'), AuthController.getAllUsers);
// router.patch('/users/:id', auth(), profilePhotoUpload, AuthController.updateUser);
router.patch('/users/:id', auth(), profilePhotoUpload, AuthController.updateProfile);
router.patch('/profile', auth(), profilePhotoUpload,  AuthController.updateProfile)
router.delete('/users/:id', auth(), AuthController.deleteUser);
router.patch('/change-password', auth(), AuthController.changePassword);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.get('/me', auth(), AuthController.getMe);
router.delete('/users', auth(), AuthController.deleteUsers);

export const AuthRoutes = router;