import { Router } from "express";
import { aiSummary } from "../controllers/aiController.js";

const router = Router();

router.post("/summary", aiSummary);

export default router;
