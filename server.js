const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fetch = require('node-fetch'); // <-- simple require
const path = require('path'); // ✅ for file paths

const app = express();
const PORT = process.env.PORT;

if (!PORT) {
  throw new Error('❌ PORT environment variable is missing!');
}

app.use(cors());

// ✅ Serve static files from the "public" folder
app.use(express.static(path.join(__dirname)));

// ✅ If user goes to "/", send the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('screenshot'), async (req, res) => {
  try {
    const playerId = req.body.playerId;
    const file = req.file;

    if (!playerId || !file) {
      return res.status(400).json({ success: false, message: '❌ Missing playerId or file.' });
    }

    const mimeType = file.mimetype;
    const base64 = `data:${mimeType};base64,${file.buffer.toString('base64')}`;

    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzs7RssJbAq7xwzNev3UQiKungjM7BuHQyeWovQVIwuM0pG4x09tyWzfbL2V9jWgZEBPA/exec';

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        path: 'uploadScreenshot',
        playerId: playerId,
        image: base64
      })
    });

    const result = await response.json();
    res.status(200).json(result);

  } catch (err) {
    console.error('❌ Upload failed:', err);
    res.status(500).json({ success: false, message: `❌ Server error: ${err.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
