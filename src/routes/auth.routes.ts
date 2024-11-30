import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    console.error('Erro na rota /register:', error);
    res.status(500).json({ message: 'Erro no servidor ao registrar o usuário.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    console.error('Erro na rota /login:', error);
    res.status(500).json({ message: 'Erro no servidor ao realizar login.' });
  }
});

export default router;
