import { Router, Response, Request } from "express";
import {
  deleteUser,
  loginUser,
  registerUser,
} from "../controllers/authController";
import {
  authenticateToken,
  validateSignin,
  validateSignup,
  AuthRequest,
  authenticateAPI,
} from "../services/authServices";

export const authRoutes = Router();

authRoutes.post(
  "/sign-up",
  authenticateAPI,
  validateSignup,
  async (req: Request, res: Response) => {
    try {
      const { nome, sobrenome, email, senha } = req.body;
      const request = await registerUser(nome, sobrenome, email, senha);
      res.status(request.status).json({
        msg: request.msg,
        user: request.user,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        msg: "Ocorreu um durante o cadastro do usuário.",
      });
    }
  }
);

authRoutes.post(
  "/sign-in",
  authenticateAPI,
  validateSignin,
  async (req: Request, res: Response) => {
    try {
      const { email, senha } = req.body;
      const request = await loginUser(email, senha);
      res.status(request.status).json({
        msg: request.msg,
        user: request.user,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        msg: "Ocorreu um durante o cadastro do usuário.",
      });
    }
  }
);

authRoutes.delete(
  "/user/:id",
  authenticateAPI,
  async (req: AuthRequest, res: Response) => {
    const id_param = req.params.id;
    if (!/^\d+$/.test(id_param)) {
      return res.status(400).json({ msg: "Invalid user ID format" });
    }
    let id = Number(id_param);
    try {
      const request = await deleteUser(id);
      return res.status(request.status).json({ msg: request.msg });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        msg: "Ocorreu um durante o cadastro do usuário.",
      });
    }
  }
);
