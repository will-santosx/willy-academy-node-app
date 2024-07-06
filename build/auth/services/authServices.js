"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.authenticateAPI = exports.authenticateToken = exports.validateSignin = exports.validateSignup = void 0;
exports.hashPassword = hashPassword;
const bcrypt = __importStar(require("bcrypt"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt.genSalt(15);
        const hashedPassword = yield bcrypt.hash(password, salt);
        return hashedPassword;
    });
}
exports.validateSignup = [
    (0, express_validator_1.check)("nome").notEmpty().withMessage("Nome é obrigatório."),
    (0, express_validator_1.check)("sobrenome").notEmpty().withMessage("Sobrenome é obrigatório."),
    (0, express_validator_1.check)("email")
        .isEmail()
        .withMessage("Insira um email válido.")
        .notEmpty()
        .withMessage("Email é obrigatório."),
    (0, express_validator_1.check)("senha")
        .isLength({ min: 8 })
        .withMessage("Senha deve conter no mínimo 8 caracteres.")
        .notEmpty()
        .withMessage("Senha é obrigatório.")
        .matches(/[A-Z]/)
        .withMessage("Senha deve conter uma letra maiscúla.")
        .matches(/\d/)
        .withMessage("Senha deve conter um número."),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg });
        }
        next();
    },
];
exports.validateSignin = [
    (0, express_validator_1.check)("email").isEmail().withMessage("Insira um email válido."),
    (0, express_validator_1.check)("senha").notEmpty().withMessage("Senha é obrigatório."),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg });
        }
        next();
    },
];
const authenticateToken = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).json({ msg: "Não autorizado, confira o token." });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        req.user = decoded.user;
        if (req.user.id !== Number(process.env.APP_OWNER_ID)) {
            return res
                .status(401)
                .json({ msg: "Somente administradores podem remover usuários." });
        }
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "Token inválido." });
    }
};
exports.authenticateToken = authenticateToken;
const authenticateAPI = (req, res, next) => {
    const apiKey = req.query.api_key;
    const apiToken = process.env.API_KEY;
    if (!apiKey) {
        return res.status(401).json({ msg: "Não autorizado, confira sua chave." });
    }
    if (apiKey !== apiToken) {
        return res.status(401).json({ msg: "Não autorizado, confira sua chave." });
    }
    try {
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "Token inválido." });
    }
};
exports.authenticateAPI = authenticateAPI;
