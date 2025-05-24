require('dotenv').config();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const connectDB = require('./db');
const Text = require('./models/Text');

const express = require('express');
app.use(cors({
    origin: 'https://your-frontend-domain.com',
    credentials: true,
  }));
// const { nanoid } = require('nanoid');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.post('/share', async (req, res) => {
    const { text, expiresInSeconds } = req.body;
    const savedText = await new Text({ text, expiresAt: Date.now() + expiresInSeconds * 1000 }).save();
    const fullLink = `${process.env.BASE_URL}/view/${savedText._id}`;
    res.json({ link: fullLink });
  });

app.get('/view/:id', async (req, res) => {
    const { id } = req.params;
  
    const textEntry = await Text.findById(id);
    if (!textEntry) {
      return res.status(404).send('Link not found or expired');
    }
  
    res.send(`<pre>${textEntry.text}</pre>`);
  });

  setInterval(async () => {
    try {
      const result = await Text.deleteMany({
        expiresAt: { $lte: new Date() }
      });
  
      if (result.deletedCount > 0) {
        console.log(`Deleted ${result.deletedCount} expired text(s)`);
      }
    } catch (err) {
      console.error('Error deleting expired texts:', err);
    }
  }, 60000);

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  