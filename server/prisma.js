// prisma.js
const { PrismaClient } = require("@prisma/client");

// Create a single shared Prisma instance
const prisma = new PrismaClient();

// Export it so other files can use it
module.exports = { prisma };
