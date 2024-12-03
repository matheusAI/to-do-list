import express from "express";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes"
import taskRoutes from "./routes/task.routes"
import dotenv from 'dotenv';

dotenv.config();

const app = express();


connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', taskRoutes);


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
