import * as bcrypt from "bcrypt";
import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { user_dev } from "@prisma/client";

dotenv.config();

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(15);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

export const validateSignup = [
  check("nome").notEmpty().withMessage("Nome é obrigatório."),
  check("sobrenome").notEmpty().withMessage("Sobrenome é obrigatório."),
  check("email")
    .isEmail()
    .withMessage("Insira um email válido.")
    .notEmpty()
    .withMessage("Email é obrigatório."),
  check("senha")
    .isLength({ min: 8 })
    .withMessage("Senha deve conter no mínimo 8 caracteres.")
    .notEmpty()
    .withMessage("Senha é obrigatório.")
    .matches(/[A-Z]/)
    .withMessage("Senha deve conter uma letra maiscúla.")
    .matches(/\d/)
    .withMessage("Senha deve conter um número."),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0].msg });
    }
    next();
  },
];

export const validateSignin = [
  check("email").isEmail().withMessage("Insira um email válido."),
  check("senha").notEmpty().withMessage("Senha é obrigatório."),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0].msg });
    }
    next();
  },
];

export interface AuthRequest extends Request {
  user?: { id: number };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "Não autorizado, confira o token." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      user: { id: number };
    };
    req.user = decoded.user;
    if (req.user.id !== Number(process.env.APP_OWNER_ID)) {
      return res
        .status(401)
        .json({ msg: "Somente administradores podem remover usuários." });
    }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token inválido." });
  }
};

export function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["x-functions-key"];
  const validApiKey = process.env.API_KEY;

  if (apiKey === validApiKey) {
    next();
  } else {
    res.status(403).json({ message: "Chave inválida" });
  }
}
