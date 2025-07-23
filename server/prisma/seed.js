const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cases = [
    {
      caseNumber: 'CASE1001',
      eventDate: new Date('2023-08-10'),
      eventTime: '14:45',
      crimeType: 'theft',
    },
    {
      caseNumber: 'CASE1002',
      eventDate: new Date('2023-07-22'),
      eventTime: '09:30',
      crimeType: 'assault',
    },
    {
      caseNumber: 'CASE1003',
      eventDate: new Date('2023-06-18'),
      eventTime: '22:15',
      crimeType: 'arson',
    },
    {
      caseNumber: 'CASE1004',
      eventDate: new Date('2023-09-03'),
      eventTime: '18:00',
      crimeType: 'fraud',
    },
    {
      caseNumber: 'CASE1005',
      eventDate: new Date('2023-05-12'),
      eventTime: '01:20',
      crimeType: 'theft',
    },
  ];

  for (const caseData of cases) {
    await prisma.case.create({ data: caseData });
  }

  console.log('Seed data inserted.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
