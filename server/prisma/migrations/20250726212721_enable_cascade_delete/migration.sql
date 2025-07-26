-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_device_images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "deviceId" INTEGER NOT NULL,
    CONSTRAINT "device_images_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_device_images" ("deviceId", "id", "path") SELECT "deviceId", "id", "path" FROM "device_images";
DROP TABLE "device_images";
ALTER TABLE "new_device_images" RENAME TO "device_images";
CREATE TABLE "new_devices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "collectedAt" DATETIME NOT NULL,
    "caseId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "devices_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_devices" ("caseId", "collectedAt", "createdAt", "id", "name", "type", "updatedAt") SELECT "caseId", "collectedAt", "createdAt", "id", "name", "type", "updatedAt" FROM "devices";
DROP TABLE "devices";
ALTER TABLE "new_devices" RENAME TO "devices";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
