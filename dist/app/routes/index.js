"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_routes_1 = require("../module/Auth/Auth.routes");
const Position_routes_1 = require("../module/Position/Position.routes");
const Application_routes_1 = require("../module/Application/Application.routes");
const Evaluation_routes_1 = require("../module/Evaluation/Evaluation.routes");
const router = (0, express_1.Router)();
const routes = [
    {
        path: '/auth',
        route: Auth_routes_1.AuthRoutes,
    },
    {
        path: '/positions',
        route: Position_routes_1.PositionRoutes,
    },
    {
        path: '/applications',
        route: Application_routes_1.ApplicationRoutes,
    },
    {
        path: '/evaluations',
        route: Evaluation_routes_1.EvaluationRoutes,
    }
];
routes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
