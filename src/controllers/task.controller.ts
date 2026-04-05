import { Request, Response } from 'express';
import Task from '../models/task.model';
import redisClient from '../config/redis';

const invalidateTaskCache = async (userId?: string): Promise<void> => {
  if (!userId) return;

  const keys = [
    `cache:user:${userId}:/api/tasks`,
    `cache:user:${userId}:/api/tasks/GET`,
  ];

  await Promise.all(
    keys.map((key) =>
      redisClient
        .del(key)
        .catch((error) => console.error('Erro ao invalidar cache:', error))
    )
  );
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { title, description, status } = req.body;

    const task = await Task.create({ title, description, status, user: userId });
    await invalidateTaskCache(userId);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar tarefa.', error });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const tasks = await Task.find({ user: userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar tarefas.', error });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.userId },
      { status },
      { new: true }
    );
    if (!task) return res.status(404).json({ mensagem: 'Tarefa não encontrada.' });

    await invalidateTaskCache(req.userId);

    res.json(task);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar tarefa.', error });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.userId }); // Garante que a tarefa pertence ao usuário autenticado
    if (!task) return res.status(404).json({ mensagem: 'Tarefa não encontrada.' });

    await invalidateTaskCache(req.userId);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao deletar tarefa.', error });
  }
};
