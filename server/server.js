const archiver = require('archiver');
const fs = require('fs');

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

const multer = require('multer');
const path = require('path');

// Save uploads in /uploads folder
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // get original extension
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, unique);
  },
});

const upload = multer({ storage }); // ← use the configured storage




app.use(cors());
app.use(express.json());

// POST /devices with image
//const upload = multer({ dest: 'uploads/' });

app.post('/devices', upload.array('images'), async (req, res) => {
  try {
    const { name, type, collectedAt, caseId } = req.body;
    const imagePaths = req.files.map(file => file.path); // relative paths

    const device = await prisma.device.create({
      data: {
        name,
        type,
        collectedAt: new Date(collectedAt),
        caseId: parseInt(caseId),
        images: {
          create: imagePaths.map(path => ({ path }))
        }
      },
      include: {
        images: true
      }
    });

    res.status(201).json(device);
  } catch (err) {
    console.error('Error creating device with images:', err);
    res.status(500).json({ error: 'Failed to create device' });
  }
});


// serve static uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
      console.log('BODY:', req.body);
      console.log('FILES:', req.files);

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
  console.log("Fetching devices for case ID:", id);

  try {
    const devices = await prisma.device.findMany({
      where: { caseId: parseInt(req.params.id) },
      include: { images: true }
    });
    console.log("Found devices:", devices);
    res.json(devices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});




// Format device list
function formatDeviceLine(device) {
  const collected = new Date(device.collectedAt);
  const localTime = collected.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `- ${device.name} (${device.type}) – Collected at ${localTime}`;
}

app.get('/cases/:id/export', async (req, res) => {
  const caseId = parseInt(req.params.id);

  try {
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        devices: {
          include: { images: true }
        }
      },

    });

    if (!caseData) return res.status(404).send('Case not found');

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=case_${caseId}_evidence.zip`);

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(res);

    const summaryLines = [
      `Case #: ${caseData.caseNumber}`,
      `Crime Type: ${caseData.crimeType}`,
      `Event Date: ${caseData.eventDate.toISOString().split('T')[0]}`,
      `Event Time: ${caseData.eventTime}`,
      ``,
      `Collected Devices:`,
      ...caseData.devices.map(formatDeviceLine),
    ];

    archive.append(summaryLines.join('\n'), { name: 'summary.txt' });
    archive.append(JSON.stringify(caseData.devices, null, 2), { name: 'metadata.json' });

    for (const device of caseData.devices) {
      if (Array.isArray(device.images)) {
        for (const [index, image] of device.images.entries()) {
          if (fs.existsSync(image.path)) {
            const imageName = `images/${device.name.replace(/\s+/g, '_')}_${index + 1}${path.extname(image.path)}`;
            archive.file(image.path, { name: imageName });
          }
        }
      }
    }


    await archive.finalize();
  } catch (err) {
    console.error('Error generating ZIP:', err);
    res.status(500).send('Failed to export evidence.');
  }
});




app.delete('/cases/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // Optional: Delete associated devices and images first (if not using cascading deletes)
    const devices = await prisma.device.findMany({
      where: { caseId: id },
      include: { images: true },
    });

    for (const device of devices) {
      // Delete image records
      await prisma.image.deleteMany({
        where: { deviceId: device.id }
      });

      // Optionally delete image files from disk
      for (const image of device.images) {
        if (fs.existsSync(image.path)) {
          fs.unlinkSync(image.path);
        }
      }
    }

    // Delete devices
    await prisma.device.deleteMany({ where: { caseId: id } });

    // Delete the case
    await prisma.case.delete({ where: { id } });

    res.status(200).json({ message: 'Case and related data deleted successfully.' });
  } catch (err) {
    console.error('Error deleting case:', err);
    res.status(500).json({ error: 'Failed to delete case.' });
  }
});





app.listen(4000, () => console.log('API running on http://localhost:4000'));
