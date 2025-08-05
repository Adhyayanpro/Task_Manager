
import mongoose, { Schema, Document } from "mongoose";

interface IRating {
  userId: mongoose.Types.ObjectId ;
  rating: number;
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  dueDate?: Date;
  user: mongoose.Types.ObjectId;
  ratings: IRating[];  
}

const ratingSchema = new Schema<IRating>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true }
});

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending"
    },
    dueDate: Date,
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    
    // ✅ Insert this:
    ratings: [ratingSchema]
  },
  { timestamps: true }
);

export default mongoose.model<ITask>("Task", taskSchema);
