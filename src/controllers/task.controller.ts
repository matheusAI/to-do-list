import { Request, Response } from "express";
import Task from "../models/task.model";

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { title, description, status } = req.body;

    const task = await Task.create({ title, description, status, user: userId });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao criar tarefa.", error });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const tasks = await Task.find({ user: userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar tarefas.", error });
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
    if (!task) return res.status(404).json({ mensagem: "Tarefa não encontrada." });
    res.json(task);
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao atualizar tarefa.", error });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: id, user: req.userId }); // Garante que a tarefa pertence ao usuário autenticado
    if (!task) return res.status(404).json({ mensagem: "Tarefa não encontrada." });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao deletar tarefa.", error });
  }
};
