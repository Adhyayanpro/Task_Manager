
import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  dueDate?: Date;
  user: mongoose.Types.ObjectId;
}

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending"
  },
  dueDate: Date,
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model<ITask>("Task", taskSchema);
