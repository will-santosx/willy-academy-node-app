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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authServices_1 = require("../services/authServices");
exports.authRoutes = (0, express_1.Router)();
exports.authRoutes.post("/sign-up", authServices_1.authenticateAPI, authServices_1.validateSignup, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, sobrenome, email, senha } = req.body;
        const request = yield (0, authController_1.registerUser)(nome, sobrenome, email, senha);
        res.status(request.status).json({
            msg: request.msg,
            user: request.user,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Ocorreu um durante o cadastro do usuário.",
        });
    }
}));
exports.authRoutes.post("/sign-in", authServices_1.authenticateAPI, authServices_1.validateSignin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, senha } = req.body;
        const request = yield (0, authController_1.loginUser)(email, senha);
        res.status(request.status).json({
            msg: request.msg,
            user: request.user,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Ocorreu um durante o cadastro do usuário.",
        });
    }
}));
exports.authRoutes.delete("/user/:id", authServices_1.authenticateAPI, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id_param = req.params.id;
    if (!/^\d+$/.test(id_param)) {
        return res.status(400).json({ msg: "Invalid user ID format" });
    }
    let id = Number(id_param);
    try {
        const request = yield (0, authController_1.deleteUser)(id);
        return res.status(request.status).json({ msg: request.msg });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: "Ocorreu um durante o cadastro do usuário.",
        });
    }
}));
