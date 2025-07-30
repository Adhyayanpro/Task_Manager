
import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI!;

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`Server listening on port ${PORT}`)
    );
  } catch (err) {
    console.error("DB connection error:", err);
  }
};

startServer();
