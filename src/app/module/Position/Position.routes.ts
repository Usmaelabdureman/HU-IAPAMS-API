import { Router } from "express";
import { PositionController } from "./Position.controllers";
import { auth } from "../../middlewares/auth";

const router = Router();


router.post("/create", auth(), PositionController.createPosition);
router.get("/", PositionController.getAllPositions);
router.get("/:id", PositionController.getPositionById);
router.patch("/:id", auth(), PositionController.updatePosition);
router.delete("/:id",auth(), PositionController.closePosition);


export const PositionRoutes = router;
