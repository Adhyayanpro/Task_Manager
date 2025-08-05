import mongoose from "mongoose";
import { Response } from "express";
import Task from "../models/task.model";
import { AuthRequest } from "../middleware/auth.middleware";

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, dueDate } = req.body;
  const task = await Task.create({ title, description, dueDate, user: req.userId });
  res.status(201).json(task);
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  const tasks = await Task.find({ user: req.userId });
  res.json(tasks);
};

export const getTask = async (req: AuthRequest, res: Response) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.userId });
  if (!task) return res.status(404).json({ message: "Not found" });
  res.json(task);
};

export const getSummary = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ user: req.userId });

    const summary = { pending: 0, "in-progress": 0, completed: 0 };
    let overdueCount = 0;
    const now = new Date();

    tasks.forEach(task => {
      summary[task.status]++;
     
      if (
        task.dueDate &&
        task.status !== "completed" &&
        new Date(task.dueDate).getTime() < now.getTime()
      ) {
        overdueCount++;
      }
    });

    res.json({ summary, overdueCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate summary", error });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found or unauthorized" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};


export const rateTask = async (req: AuthRequest, res: Response) => {
  console.log("Body:", req.body);
  const { rating } = req.body;
  const userId = req.userId;
  const taskId = req.params.id;

  console.log("Received rating:", rating, "Type:", typeof rating);

  const parsedRating = Number(rating);
  if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const task = await Task.findOne({ _id: taskId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const userObjectId = new mongoose.Types.ObjectId(userId); // ✅ moved this up
    const existingRating = task.ratings.find(
      (r) => r.userId.toString() === userObjectId.toString()
    );

    if (existingRating) {
      existingRating.rating = parsedRating;
    } else {
      task.ratings.push({ userId: userObjectId, rating: parsedRating });
    }

    await task.save();
    res.json({ message: "Rating saved", task });
  } catch (err) {
    res.status(500).json({ message: "Failed to rate task", error: err });
  }
};


export const getTasksWithAvgRating = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId) 
        }
      },
      {
        $addFields: {
          averageRating: { $avg: "$ratings.rating" }
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          status: 1,
          dueDate: 1,
          averageRating: 1
        }
      }
    ]);

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Aggregation failed", error: err });
  }
};

