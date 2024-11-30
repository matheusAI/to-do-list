import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import redisClient from '../config/redis';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { nome, email, password } = req.body;

    if (!nome || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'E-mail já registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ nome, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: 'Usuário registrado com sucesso.', userId: newUser._id });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    await redisClient.set(token, JSON.stringify({ id: user._id }), { ex: 3600 });

    return res.status(200).json({ message: 'Login bem-sucedido.', token });
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    return res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
  }
};
