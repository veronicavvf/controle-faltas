/*
  Warnings:

  - You are about to drop the column `nome` on the `Disciplina` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `Falta` table. All the data in the column will be lost.
  - Added the required column `nomeDisciplina` to the `Disciplina` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Disciplina" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomeDisciplina" TEXT NOT NULL,
    "totalAulas" INTEGER NOT NULL,
    "limiteFaltas" INTEGER NOT NULL,
    "usuarioId" TEXT NOT NULL,
    CONSTRAINT "Disciplina_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Disciplina" ("id", "limiteFaltas", "totalAulas", "usuarioId") SELECT "id", "limiteFaltas", "totalAulas", "usuarioId" FROM "Disciplina";
DROP TABLE "Disciplina";
ALTER TABLE "new_Disciplina" RENAME TO "Disciplina";
CREATE TABLE "new_Falta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disciplinaId" TEXT NOT NULL,
    CONSTRAINT "Falta_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Falta" ("data", "disciplinaId", "id") SELECT "data", "disciplinaId", "id" FROM "Falta";
DROP TABLE "Falta";
ALTER TABLE "new_Falta" RENAME TO "Falta";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
