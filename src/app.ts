import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const app_port = Number(process.env.PORT) || 8905;

app.use(express.json());
app.use(cors());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
  );
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.status(201).send("<span>Funcionando!</span>");
});

app.listen(app_port, () => {
  console.log("Servidor local rodando em: http://localhost:" + app_port);
});
