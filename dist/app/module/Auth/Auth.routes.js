"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
// Auth.routes.ts
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const Auth_controllers_1 = require("./Auth.controllers");
const router = (0, express_1.Router)();
router.post('/register', Auth_controllers_1.AuthController.register);
router.post('/login', Auth_controllers_1.AuthController.login);
router.get('/users', (0, auth_1.auth)('admin'), Auth_controllers_1.AuthController.getAllUsers);
router.patch('/users/:id', (0, auth_1.auth)(), Auth_controllers_1.AuthController.updateUser);
router.delete('/users/:id', (0, auth_1.auth)(), Auth_controllers_1.AuthController.deleteUser);
router.patch('/change-password', (0, auth_1.auth)(), Auth_controllers_1.AuthController.changePassword);
exports.AuthRoutes = router;
