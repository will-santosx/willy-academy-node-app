import { PrismaClient, user_dev } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { hashPassword } from "../services/authServices";

const prisma = new PrismaClient();

const generateRandomId = (): number => {
  const randomId = Math.floor(10000 + Math.random() * 90000);
  return Number(randomId);
};

const generateUniqueRandomId = async (): Promise<number> => {
  let unique = false;
  let newId: number;

  while (!unique) {
    newId = generateRandomId();
    const existingUser = await prisma.user_dev.findUnique({
      where: { id: newId },
    });

    if (!existingUser) {
      unique = true;
    }
  }

  return newId!;
};

export const registerUser = async (
  nome: string,
  sobrenome: string,
  email: string,
  senha: string
) => {
  try {
    let user = await prisma.user_dev.findUnique({ where: { email } });
    if (user) {
      return { msg: "Usuário existente.", status: 400 };
    }
    let new_user = await prisma.user_dev.create({
      data: {
        id: await generateUniqueRandomId(),
        nome,
        sobrenome,
        email: email.toLocaleLowerCase(),
        senha: await hashPassword(senha),
      },
    });
    const payload = { user: { id: new_user.id } };
    const user_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });
    return {
      msg: "Usuário criado com sucesso.",
      status: 201,
      user: {
        id: new_user.id,
        nome: new_user.nome,
        sobrenome: new_user.sobrenome,
        email: new_user.email,
        created_at: new_user.created_at,
        token: user_token,
      },
    };
  } catch (err) {
    console.error(err.message);
    return { msg: "Erro desconhecido.", status: 500 };
  }
};

export const loginUser = async (email: string, senha: string) => {
  try {
    let user = await prisma.user_dev.findUnique({ where: { email } });
    if (!user) {
      return { msg: "Email incorreto.", status: 400 };
    }
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return { msg: "Senha incorreta.", status: 400 };
    }
    const payload = { user: { id: user.id } };
    const user_token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });
    return {
      msg: "Acesso autorizado.",
      status: 200,
      user: {
        id: user.id,
        nome: user.nome,
        sobrenome: user.sobrenome,
        email: user.email,
        created_at: user.created_at,
        token: user_token,
      },
    };
  } catch (err) {
    console.error(err.message);
    return { msg: "Erro desconhecido.", status: 500 };
  }
};

export const deleteUser = async (id: number) => {
  try {
    let user = await prisma.user_dev.findUnique({ where: { id } });
    if (!user) {
      return { msg: "Usuário não existe.", status: 400 };
    }
    await prisma.user_dev.delete({ where: { id } });
    return { msg: "Usuário removido.", status: 200 };
  } catch (err) {
    console.error(err.message);
    return { msg: "Erro desconhecido.", status: 500 };
  }
};
