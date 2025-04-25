import { Router } from "express";
import { PositionController } from "./Position.controllers";

const router = Router();


router.post("/", PositionController.createPosition);
router.get("/get-all-positions", PositionController.getAllPositions);
router.get("/:id", PositionController.getPositionById);
router.put("/:id", PositionController.updatePosition);
router.delete("/:id", PositionController.closePosition);


export const PositionRoutes = router;
