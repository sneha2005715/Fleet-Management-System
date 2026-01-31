import express from "express";
import {
  createTrip,
  updateTrip,
  getTrip,
  deleteTrip,
  endTrip
} from "../controllers/trip.controller.js";
import { checkRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/create", checkRole(["customer"]), createTrip);
router.patch("/update/:tripId", checkRole(["customer"]), updateTrip);
router.get("/:tripId", getTrip);
router.delete("/delete/:tripId", checkRole(["customer"]), deleteTrip);
router.patch("/end/:tripId", endTrip);

export default router;
