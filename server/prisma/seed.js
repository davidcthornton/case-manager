const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  var passwordHash = bcrypt.hashSync('password', 10);
  await prisma.user.upsert({
    where: { email: 'wash@me.com' },
    update: {},
    create: {
      name: 'George Washington',
      email: 'wash@me.com',
      passwordHash,
    },
  });
  passwordHash = bcrypt.hashSync('1234', 10);
  await prisma.user.upsert({
    where: { email: 'linc@me.com' },
    update: {},
    create: {
      name: 'Abraham Lincoln',
      email: 'linc@me.com',
      passwordHash,
    },
  });
  console.log('Seeded demo users.');
}

main().finally(() => prisma.$disconnect());
