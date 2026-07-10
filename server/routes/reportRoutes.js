import { Router } from "express";
import { emailReport, updateSchedule } from "../controllers/reportController.js";

const router = Router();

router.post("/email", emailReport);
router.post("/schedule", updateSchedule);

export default router;
