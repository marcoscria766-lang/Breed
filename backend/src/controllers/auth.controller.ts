import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import { generateToken } from '../utils/jwt';
import { validateEmail, validatePassword, validateUsername } from '../middleware/validation';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validations
    if (!username || !email || !password || !confirmPassword) {
      res.status(400).json({ error: 'Todos os campos são obrigatórios' });
      return;
    }

    if (!validateUsername(username)) {
      res.status(400).json({ error: 'Nome de usuário deve conter 3-20 caracteres alfanuméricos' });
      return;
    }

    if (!validateEmail(email)) {
      res.status(400).json({ error: 'Email inválido' });
      return;
    }

    if (!validatePassword(password)) {
      res.status(400).json({
        error: 'Senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula e um número',
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: 'As senhas não coincidem' });
      return;
    }

    // Check if user exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1 OR username = $2', [
      email,
      username,
    ]);

    if (existingUser.rows.length > 0) {
      res.status(409).json({ error: 'Usuário ou email já existe' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [username, email, hashedPassword, 'CLIENT']
    );

    const user = result.rows[0];
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email e senha são obrigatórios' });
      return;
    }

    const result = await query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Email ou senha incorretos' });
      return;
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      res.status(401).json({ error: 'Email ou senha incorretos' });
      return;
    }

    // Update last login
    await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: 'Autenticado com sucesso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        minecraft_nick: user.minecraft_nick,
        discord_nick: user.discord_nick,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ error: 'Token é obrigatório' });
      return;
    }

    const result = await query('SELECT id, email, role FROM users WHERE id = $1', [
      (token as any).id,
    ]);

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Usuário não encontrado' });
      return;
    }

    const user = result.rows[0];
    const newToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({ token: newToken });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Erro ao renovar token' });
  }
};
