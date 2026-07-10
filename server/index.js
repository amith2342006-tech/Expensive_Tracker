import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reportRoutes from "./routes/reportRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { startReminderCron } from "./services/cronService.js";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => res.json({ status: "ok", service: "expense-calculator-pro-server" }));
app.use("/api/reports", reportRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Expense Calculator Pro server running on http://localhost:${PORT}`);
  startReminderCron();
});
