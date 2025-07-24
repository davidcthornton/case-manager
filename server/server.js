const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});


app.get('/cases', async (req, res) => {
  try {
    const cases = await prisma.case.findMany({
      orderBy: { eventDate: 'desc' }, // Optional: sort by event date
    });
    res.json(cases);
  } catch (err) {
    console.error('Error fetching cases:', err);
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});


app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({ data: { name, email } });
  res.json(user);
});



app.get('/cases/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const found = await prisma.case.findUnique({ where: { id } });
    if (!found) {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.json(found);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving case' });
  }
});


app.post('/cases', async (req, res) => {
  const { caseNumber, eventDate, eventTime, crimeType } = req.body;

  try {
    const newCase = await prisma.case.create({
      data: {
        caseNumber,
        eventDate: new Date(eventDate),
        eventTime,
        crimeType
      }
    });

    res.status(201).json(newCase);
  } catch (err) {
    console.error('Error saving case:', err);
    if (err.code === 'P2002') {
      res.status(400).json({ error: 'Case number already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create case' });
    }
  }
});


app.put('/cases/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { caseNumber, eventDate, eventTime, crimeType } = req.body;

  try {
    const updated = await prisma.case.update({
      where: { id },
      data: {
        caseNumber,
        eventDate: new Date(eventDate),
        eventTime,
        crimeType,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('Error updating case:', err);
    res.status(500).json({ error: 'Failed to update case' });
  }
});


app.post('/devices', async (req, res) => {
  const { name, type, collectedAt, caseId } = req.body;

  try {
    const device = await prisma.device.create({
      data: {
        name,
        type,
        collectedAt: new Date(collectedAt),
        case: { connect: { id: parseInt(caseId) } }
      }
    });

    res.status(201).json(device);
  } catch (err) {
    console.error('Error creating device:', err);
    res.status(500).json({ error: 'Failed to create device' });
  }
});


app.get('/cases/:id/devices', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const devices = await prisma.device.findMany({ where: { caseId: id } });
    res.json(devices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});


app.listen(4000, () => console.log('API running on http://localhost:4000'));
