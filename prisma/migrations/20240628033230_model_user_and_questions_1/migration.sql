-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
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

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
