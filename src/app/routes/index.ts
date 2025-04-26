import { Router } from "express";
import { AuthRoutes } from "../module/Auth/Auth.routes";
import { PositionRoutes } from "../module/Position/Position.routes";

const router = Router();

const routes = [
{
    path: '/auth',
    route: AuthRoutes,
},
{
    path: '/positions',
    route: PositionRoutes,

}
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;