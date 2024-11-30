import express from "express";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes"
import taskRoutes from "./routes/task.routes"

const app = express();

import dotenv from 'dotenv';

connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
