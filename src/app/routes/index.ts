import { Router } from "express";
import { AuthRoutes } from "../module/Auth/Auth.routes";



const router = Router();

const routes = [
{
    path: '/auth',
    route: AuthRoutes,
}
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;