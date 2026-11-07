import { Router } from "express";
import mongoose from "mongoose";
import Todo from "../models/Todo.js";

const router = Router();

// GET /api/todos - retrieve all tasks
router.get("/", async (_req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch {
    res.status(500).json({ message: "Could not fetch tasks" });
  }
});

// POST /api/todos - create a task
router.post("/", async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    if (!title) return res.status(400).json({ message: "Task title is required" });
    const todo = await Todo.create({ title });
    res.status(201).json(todo);
  } catch {
    res.status(500).json({ message: "Could not create task" });
  }
});

// PUT /api/todos/:id - update task title or completion status
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: "Invalid task ID" });

    const updates = {};
    if (typeof req.body.title === "string") {
      const title = req.body.title.trim();
      if (!title) return res.status(400).json({ message: "Task title cannot be empty" });
      updates.title = title;
    }
    if (typeof req.body.completed === "boolean") updates.completed = req.body.completed;

    const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true
    });
    if (!todo) return res.status(404).json({ message: "Task not found" });
    res.json(todo);
  } catch {
    res.status(500).json({ message: "Could not update task" });
  }
});

// DELETE /api/todos/:id - delete a task
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ message: "Invalid task ID" });
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch {
    res.status(500).json({ message: "Could not delete task" });
  }
});

export default router;