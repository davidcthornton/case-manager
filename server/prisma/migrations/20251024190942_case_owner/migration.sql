/*
  Warnings:

  - Added the required column `ownerId` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Case" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "caseNumber" TEXT NOT NULL,
    "eventDate" DATETIME NOT NULL,
    "eventTime" TEXT NOT NULL,
    "crimeType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Case_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Case" ("caseNumber", "createdAt", "crimeType", "eventDate", "eventTime", "id", "updatedAt") SELECT "caseNumber", "createdAt", "crimeType", "eventDate", "eventTime", "id", "updatedAt" FROM "Case";
DROP TABLE "Case";
ALTER TABLE "new_Case" RENAME TO "Case";
CREATE UNIQUE INDEX "Case_caseNumber_key" ON "Case"("caseNumber");
CREATE UNIQUE INDEX "Case_ownerId_caseNumber_key" ON "Case"("ownerId", "caseNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
