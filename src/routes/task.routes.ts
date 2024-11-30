import express from 'express';
import { cacheMiddleware } from '../middleware/cache.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { createTask, updateTaskStatus, deleteTask, getTasks } from '../controllers/task.controller';

const router = express.Router();

router.post('/tasks', authMiddleware, async (req, res) => {
  await createTask(req, res);
});

router.get('/tasks', authMiddleware, cacheMiddleware, async (req, res) => {
  await getTasks(req, res);
});

router.patch('/tasks/:id', authMiddleware, async (req, res) => {
  await updateTaskStatus(req, res);
});

router.delete('/tasks/:id', authMiddleware, async (req, res) => {
  await deleteTask(req, res);
});

export default router;
