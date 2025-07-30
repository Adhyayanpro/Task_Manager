
import express from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getSummary
} from "../controllers/task.controller";
const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.get("/summary", getSummary);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
