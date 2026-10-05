-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Falta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disciplinaId" TEXT NOT NULL,
    CONSTRAINT "Falta_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Falta" ("data", "disciplinaId", "id") SELECT "data", "disciplinaId", "id" FROM "Falta";
DROP TABLE "Falta";
ALTER TABLE "new_Falta" RENAME TO "Falta";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
