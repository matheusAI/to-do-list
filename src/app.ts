import express from "express";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes"
import taskRoutes from "./routes/task.routes"

const app = express();

connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

export default app;
