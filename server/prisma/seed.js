const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 🧹 Delete existing data in correct order
  await prisma.device.deleteMany();
  await prisma.case.deleteMany();

  // 📦 Create test cases
  const case1 = await prisma.case.create({
    data: {
      caseNumber: 'CASE1001',
      eventDate: new Date('2023-08-10'),
      eventTime: '14:45',
      crimeType: 'theft',
    },
  });

  const case2 = await prisma.case.create({
    data: {
      caseNumber: 'CASE1002',
      eventDate: new Date('2023-07-22'),
      eventTime: '09:30',
      crimeType: 'fraud',
    },
  });

  // 💾 Add related devices
 await prisma.device.createMany({
  data: [
    {
      name: 'iPhone 12',
      type: 'smartphone', // ✅ matches enum
      collectedAt: new Date('2023-08-11T10:00:00Z'),
      caseId: case1.id,
	  imagePath: 'uploads/macbook.jpg'
    },
    {
      name: 'Samsung USB Drive',
      type: 'removablemedia',
      collectedAt: new Date('2023-08-11T10:15:00Z'),
      caseId: case1.id,
	  imagePath: 'uploads/imac.jpg'
    },
    {
      name: 'MacBook Pro',
      type: 'laptop',
      collectedAt: new Date('2023-07-23T13:00:00Z'),
      caseId: case2.id,
	  imagePath: 'uploads/2e.jpg'
    },
  ],
});


  console.log('✅ Seed data inserted.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
