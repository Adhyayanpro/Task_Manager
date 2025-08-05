
import express from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getSummary,
  rateTask,
  getTasksWithAvgRating,
} from "../controllers/task.controller";
const router = express.Router();
import { authMiddleware } from "../middleware/auth.middleware";

router.post("/", authMiddleware, createTask);
router.post("/:id/rate", authMiddleware, rateTask); 
router.get("/summary", authMiddleware, getSummary);
router.get("/with-rating", authMiddleware, getTasksWithAvgRating);
router.get("/", authMiddleware, getTasks);
router.get("/:id", authMiddleware, getTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);



export default router;
