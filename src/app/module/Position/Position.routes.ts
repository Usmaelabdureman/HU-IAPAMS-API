import { Router } from "express";
import { PositionController } from "./Position.controllers";
import { auth } from "../../middlewares/auth";

const router = Router();


router.post("/create", auth(), PositionController.createPosition);
router.get("/", PositionController.getAllPositions);
router.get("/:id", PositionController.getPositionById);
router.put("/:id", PositionController.updatePosition);
router.delete("/:id", PositionController.closePosition);


export const PositionRoutes = router;
