"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_routes_1 = require("../module/Auth/Auth.routes");
const Position_routes_1 = require("../module/Position/Position.routes");
const router = (0, express_1.Router)();
const routes = [
    {
        path: '/auth',
        route: Auth_routes_1.AuthRoutes,
    },
    {
        path: '/positions',
        route: Position_routes_1.PositionRoutes,
    }
];
routes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
