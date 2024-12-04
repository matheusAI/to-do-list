import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: { id: string; email: string };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(401).json({ mensagem: "Token não fornecido." });
    return;
  }

  try {
    const cachedToken = await redisClient.get(token);
    if (!cachedToken) {
      res.status(401).json({ mensagem: "Token inválido ou expirado." });
      return;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };

    req.userId = payload.id;
    req.user = { id: payload.id, email: payload.email };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ mensagem: "Token inválido.", error });
    } else {
      res.status(500).json({ mensagem: "Erro ao autenticar.", error });
    }
  }
};
