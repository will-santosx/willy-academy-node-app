/*
  Warnings:

  - You are about to drop the `questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "questions";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "user_dev" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_dev_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions_dev" (
    "id" SERIAL NOT NULL,
    "ano" INTEGER NOT NULL,
    "banca" TEXT NOT NULL,
    "disciplina" TEXT NOT NULL,
    "topico" TEXT NOT NULL,
    "dificuldade" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "alternativas" TEXT[],
    "gabarito" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_dev_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_dev_email_key" ON "user_dev"("email");
