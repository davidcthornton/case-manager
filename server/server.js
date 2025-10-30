const archiver = require('archiver');
const fs = require('fs');

const express = require('express');
const cookieParser = require("cookie-parser");
//const { PrismaClient } = require('@prisma/client');
const { prisma } = require("./prisma");

const cors = require('cors');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
//const prisma = new PrismaClient();

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




//app.use(cors());

// --- debug incoming Origins ---
app.use((req, _res, next) => {
  if (req.headers.origin) {
    console.log('[CORS] Incoming Origin:', req.headers.origin);
  } else {
    // requests from curl/pm2 health checks/etc have no Origin
    // that's normal—don’t block those
  }
  next();
});
// -------------------------------

const allowedOrigins = ["http://localhost:3000", "http://localhost:4000", "https://appdemo.gamificationsoftware.org"];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, origin);
    else cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());




// In real life, use a DB. Example user:
//const USERS = [{ id: "u1", email: "a@example.com", passwordHash: bcrypt.hashSync("pass1234", 10), role: "user" }];

const ACCESS_SECRET = process.env.ACCESS_SECRET || "dev_access_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "dev_refresh_secret";

// Helpers
function signAccessToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, ACCESS_SECRET, { expiresIn: "15m" });
}
function signRefreshToken(user) {
  return jwt.sign({ sub: user.id }, REFRESH_SECRET, { expiresIn: "7d" });
}
function setAuthCookies(res, accessToken, refreshToken) {
  const isHttps = true; // we’ll run dev over HTTPS
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: isHttps,        // REQUIRED when SameSite: 'none'
    sameSite: "none",       // allow cross-site
    path: "/",
    maxAge: 1000 * 60 * 15
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isHttps,
    sameSite: "none",
    path: "/auth/refresh",
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
}




app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Look up user in your Prisma User table
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const access = signAccessToken(user);
    const refresh = signRefreshToken(user);
    setAuthCookies(res, access, refresh);
    res.json({ ok: true });
  } catch (e) {
    console.error("[/auth/login]", e);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/auth/refresh", (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) return res.status(401).json({ error: "No refresh token" });
  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    const user = USERS.find(u => u.id === payload.sub);
    if (!user) return res.status(401).json({ error: "Invalid" });

    // Rotation (optional: also re-issue a new refresh token)
    const newAccess = signAccessToken(user);
    const newRefresh = signRefreshToken(user);
    setAuthCookies(res, newAccess, newRefresh);
    res.json({ ok: true });
  } catch {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

function requireAuth(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: "Missing access token" });
  try {
    req.user = jwt.verify(token, ACCESS_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Expired or invalid token" });
  }
}

app.get("/me", requireAuth, (req, res) => {
  res.json({ id: req.user.sub, email: req.user.email, role: req.user.role });
});














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
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/uploads", requireAuth, express.static(path.join(__dirname, "uploads")));


app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});





app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({ data: { name, email } });
  res.json(user);
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


// server route
app.get('/cases/:id/devices', requireAuth, async (req, res) => {
  const caseId = Number(req.params.id);
  const rows = await prisma.device.findMany({
    where: { caseId, case: { ownerId: req.user.sub } }, // your ownership guard
    include: { images: true },                           // <-- critical
    orderBy: { createdAt: 'desc' }
  });
  res.json(rows);
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






async function deleteDeviceById(req, res) {
  const id = Number(req.params.id || req.params.deviceId);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid device id' });
  }

  try {
    // Load device + its DeviceImage rows (relation is named `images`)
    const device = await prisma.device.findUnique({
      where: { id },
      include: { images: true }, // Device.images: DeviceImage[]
    });

    if (!device) return res.status(404).json({ error: 'Device not found' });

    // Best-effort delete of the files those images point to
    for (const img of device.images) {
      const rel = (img.path || '').replace(/^\/+/, '');     // strip leading slashes
      const abs = path.join(process.cwd(), rel);             // e.g. ./uploads/...
      try {
        if (fs.existsSync(abs)) fs.unlinkSync(abs);
      } catch (e) {
        console.warn('Failed to delete file:', abs, e.message);
      }
    }

    // Because your schema has onDelete: Cascade for DeviceImage,
    // deleting the Device will also delete its image rows.
    await prisma.device.delete({ where: { id } });

    return res.status(200).json({ message: 'Device deleted.' });
  } catch (err) {
    console.error('Error deleting device:', err);
    return res.status(500).json({ error: 'Failed to delete device.' });
  }
}










// CREATE a case — always stamped with the logged-in user as owner
app.post("/cases", requireAuth, async (req, res) => {
  const { caseNumber, eventDate, eventTime, crimeType } = req.body;
  try {
    const created = await prisma.case.create({
      data: {
        caseNumber,
        eventDate: new Date(eventDate),
        eventTime,
        crimeType,
        ownerId: req.user.sub, // <- ownership enforced here
      },
      select: { id: true, caseNumber: true }
    });
    res.status(201).json(created);
  } catch (e) {
    // handle uniqueness errors (e.g., unique per owner)
    if (e.code === "P2002") {
      return res.status(409).json({ error: "Case number already exists" });
    }
    console.error("[POST /cases]", e);
    res.status(500).json({ error: "Server error" });
  }
});

// LIST cases — only the owner’s cases
app.get("/cases", requireAuth, async (req, res) => {
  try {
    const cases = await prisma.case.findMany({
      where: { ownerId: req.user.sub },
      orderBy: { createdAt: "desc" },
    });
    res.json(cases);
  } catch (e) {
    console.error("[GET /cases]", e);
    res.status(500).json({ error: "Server error" });
  }
});

// READ one — must belong to owner
app.get("/cases/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const c = await prisma.case.findFirst({
    where: { id, ownerId: req.user.sub },
  });
  if (!c) return res.status(404).json({ error: "Not found" });
  res.json(c);
});

// UPDATE one — constrain by owner in the WHERE
app.put("/cases/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { caseNumber, eventDate, eventTime, crimeType } = req.body;
  try {
    const updated = await prisma.case.updateMany({
      where: { id, ownerId: req.user.sub },
      data: {
        ...(caseNumber !== undefined ? { caseNumber } : {}),
        ...(eventDate !== undefined ? { eventDate: new Date(eventDate) } : {}),
        ...(eventTime !== undefined ? { eventTime } : {}),
        ...(crimeType !== undefined ? { crimeType } : {}),
      },
    });
    if (updated.count === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e) {
    if (e.code === "P2002") {
      return res.status(409).json({ error: "Case number already exists" });
    }
    console.error("[PUT /cases/:id]", e);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE one — constrain by owner in the WHERE
app.delete("/cases/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await prisma.case.deleteMany({
    where: { id, ownerId: req.user.sub },
  });
  if (deleted.count === 0) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});
















//dave, check these
// Flat route (simple)
app.delete('/devices/:id', deleteDeviceById);

// Optional nested route (if your client calls this shape)
app.delete('/cases/:caseId/devices/:deviceId', deleteDeviceById);


app.listen(4000, () => console.log('API running on http://localhost:4000'));
