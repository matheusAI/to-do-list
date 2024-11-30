import { Request, Response } from 'express';
import Task from '../models/task.model';

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar tarefa.', error });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar tarefas.', error });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) return res.status(404).json({ message: 'Tarefa não encontrada.' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar tarefa.', error });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: 'Tarefa não encontrada.' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar tarefa.', error });
  }
};
