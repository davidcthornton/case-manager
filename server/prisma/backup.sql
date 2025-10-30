PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
);
INSERT INTO _prisma_migrations VALUES('9a5d308c-d419-4fa3-bbad-74df20f86576','54bb7a7c71d26c0e1fe712e509a78682a51624c6a0307d89ff8b0e70498f10a5',1761841144317,'20250723194640_init',NULL,NULL,1761841144267,1);
INSERT INTO _prisma_migrations VALUES('ea95fb3e-95ce-410e-bc2a-daddf6403abf','ed8004dae204ed5e4c49c07b4fcad76b32ecd071794b83d68cb2c40044052dce',1761841144379,'20250723195008_add_case_model',NULL,NULL,1761841144329,1);
INSERT INTO _prisma_migrations VALUES('60ef312c-a99b-4805-afe8-83ee22af6407','dc8b58aa835d8b51fe722bb422a0a9324b297b5efc307e993c005c7b682c1a62',1761841144425,'20250724020619_add_device_model',NULL,NULL,1761841144391,1);
INSERT INTO _prisma_migrations VALUES('03bffef9-1596-4424-a8e3-010ab9436cbd','149728a2dbb20cc5df87642bb65fc650a47edc44b0d4f31a889078c91e56d0ba',1761841144472,'20250724043627_add_image_path_to_device',NULL,NULL,1761841144437,1);
INSERT INTO _prisma_migrations VALUES('5e12e5ae-d3bf-48cd-9511-a031b010dc71','1e37761027d00a1d7b743724e86eb497f6bb8d5660bfd8496a9378dcaeb57716',1761841144545,'20250725175644_add_device_images',NULL,NULL,1761841144484,1);
INSERT INTO _prisma_migrations VALUES('6adb23dc-6f56-4aea-a6f4-960c8de8e7ea','80cf60a913e05d322e589e77d2052f9dd6a240256f4eced67b034b5fa9bee1ad',1761841144672,'20250726212721_enable_cascade_delete',NULL,NULL,1761841144557,1);
INSERT INTO _prisma_migrations VALUES('375a0a3a-abcb-402e-ad87-5ee7501194f9','f0e3387ffd58cf0067eab44fe3344a8ef49a6bc674a9eac691d7b52c6702493d',1761841144779,'20251020190648_init',NULL,NULL,1761841144683,1);
INSERT INTO _prisma_migrations VALUES('5b4acab4-2d50-4868-9c25-94188f0e3143','114eaed9429ac084f8b5aeb1b5afba1c893290e968dff2d308194ba5fd76a719',1761841144893,'20251024190942_case_owner',NULL,NULL,1761841144795,1);
CREATE TABLE IF NOT EXISTS "device_images" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "path" TEXT NOT NULL,
    "deviceId" INTEGER NOT NULL,
    CONSTRAINT "device_images_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "devices" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO device_images VALUES(1,'uploads/1761841859990-5101603.jpg',1);
INSERT INTO device_images VALUES(2,'uploads/1761842049242-641530453.jpg',2);
CREATE TABLE IF NOT EXISTS "devices" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "collectedAt" DATETIME NOT NULL,
    "caseId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "devices_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO devices VALUES(1,'Logitech G Series Mouse','other',1761841861210,1,1761841875331,1761841875331);
INSERT INTO devices VALUES(2,'keyboard ','other',1761842050591,2,1761842063955,1761842063955);
CREATE TABLE IF NOT EXISTS "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user'
);
INSERT INTO User VALUES(1,'George Washington','wash@me.com','$2b$10$2hy/BUeIhWYjv9D5fT3HUeOXb3n2orTy6FF7.Y1xCMCz2xr8fFhgC','user');
INSERT INTO User VALUES(2,'Abraham Lincoln','linc@me.com','$2b$10$3xl7dZi306/GAkrLr.No1enH0Ppqkex2LBv1DSXhq10vrgau700GO','user');
CREATE TABLE IF NOT EXISTS "Case" (
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
INSERT INTO "Case" VALUES(1,'Ford''s Theatre Assassination ',-3304540800000,'18:29','assault',1761841813381,1761841813381,2);
INSERT INTO "Case" VALUES(2,'Cherry Tree Destruction ',-7231939200000,'23:33','arson',1761842029353,1761842029353,1);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('device_images',2);
INSERT INTO sqlite_sequence VALUES('devices',2);
INSERT INTO sqlite_sequence VALUES('User',2);
INSERT INTO sqlite_sequence VALUES('Case',2);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Case_caseNumber_key" ON "Case"("caseNumber");
CREATE UNIQUE INDEX "Case_ownerId_caseNumber_key" ON "Case"("ownerId", "caseNumber");
COMMIT;