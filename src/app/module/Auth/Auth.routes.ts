import { Router } from "express";
// import { AuthControllers } from "./Auth.controllers";
// import validateRequest from "../../middlewares/validateRequest";
// import { AuthValidations } from "./Auth.validations";
// import auth from "../../middlewares/auth";
// import { UserRole } from "@prisma/client";

const router = Router();

// router.post(
//   "/create-user",
//   validateRequest(AuthValidations.createUserValidationSchema),
//   AuthControllers.createUser
// );

// router.post(
//   "/login",
//   validateRequest(AuthValidations.loginUserValidationSchema),
//   AuthControllers.login
// );

// router.post(
//   "/reset-password",
//   auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
//   validateRequest(AuthValidations.resetPasswordValidationSchema),
//   AuthControllers.resetPassword
// );

// router.post(
//   "/forgot-password",
//   validateRequest(AuthValidations.forgotPasswordValidationSchema),
//   AuthControllers.forgotPassword
// );
import express from 'express';
import { AuthController } from './Auth.controllers';
import { AuthValidation } from './Auth.validations';
import validateRequest from "../../middlewares/validateRequest";



router.post(
  '/register',
  validateRequest(AuthValidation.register),
  AuthController.register
);

router.post(
  '/login',
  validateRequest(AuthValidation.login),
  AuthController.login
);

router.get(
  '/getall-users',
AuthController.getAllUsers
)


export const AuthRoutes = router;