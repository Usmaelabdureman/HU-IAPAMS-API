import { Router } from "express";
import { AuthRoutes } from "../module/Auth/Auth.routes";
import { PositionRoutes } from "../module/Position/Position.routes";
import path from "path";
import { ApplicationRoutes } from "../module/Application/Application.routes";
import { EvaluationRoutes } from "../module/Evaluation/Evaluation.routes";

const router = Router();

const routes = [
{
    path: '/auth',
    route: AuthRoutes,
},
{
    path: '/positions',
    route: PositionRoutes,

},
{
    path: '/applications',
    route:ApplicationRoutes,
},
{
    path: '/evaluations',
    route: EvaluationRoutes,
}
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;