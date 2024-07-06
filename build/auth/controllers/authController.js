"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authServices_1 = require("../services/authServices");
const prisma = new client_1.PrismaClient();
const generateRandomId = () => {
    const randomId = Math.floor(10000 + Math.random() * 90000);
    return Number(randomId);
};
const generateUniqueRandomId = () => __awaiter(void 0, void 0, void 0, function* () {
    let unique = false;
    let newId;
    while (!unique) {
        newId = generateRandomId();
        const existingUser = yield prisma.user_dev.findUnique({
            where: { id: newId },
        });
        if (!existingUser) {
            unique = true;
        }
    }
    return newId;
});
const registerUser = (nome, sobrenome, email, senha) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield prisma.user_dev.findUnique({ where: { email } });
        if (user) {
            return { msg: "Usuário existente.", status: 400 };
        }
        let new_user = yield prisma.user_dev.create({
            data: {
                id: yield generateUniqueRandomId(),
                nome,
                sobrenome,
                email: email.toLocaleLowerCase(),
                senha: yield (0, authServices_1.hashPassword)(senha),
            },
        });
        const payload = { user: { id: new_user.id } };
        const user_token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
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
    }
    catch (err) {
        console.error(err.message);
        return { msg: "Erro desconhecido.", status: 500 };
    }
});
exports.registerUser = registerUser;
const loginUser = (email, senha) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield prisma.user_dev.findUnique({ where: { email } });
        if (!user) {
            return { msg: "Email incorreto.", status: 400 };
        }
        const isMatch = yield bcrypt_1.default.compare(senha, user.senha);
        if (!isMatch) {
            return { msg: "Senha incorreta.", status: 400 };
        }
        const payload = { user: { id: user.id } };
        const user_token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
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
    }
    catch (err) {
        console.error(err.message);
        return { msg: "Erro desconhecido.", status: 500 };
    }
});
exports.loginUser = loginUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield prisma.user_dev.findUnique({ where: { id } });
        if (!user) {
            return { msg: "Usuário não existe.", status: 400 };
        }
        yield prisma.user_dev.delete({ where: { id } });
        return { msg: "Usuário removido.", status: 200 };
    }
    catch (err) {
        console.error(err.message);
        return { msg: "Erro desconhecido.", status: 500 };
    }
});
exports.deleteUser = deleteUser;
