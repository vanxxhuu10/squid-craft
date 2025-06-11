const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'index.html')));

// Serve index.html on root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Screenshot upload and email route
app.post('/upload', upload.single('screenshot'), async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'srivastavavansh64@gmail.com',         // Replace with your Gmail
        pass: 'VITChennai$123'                       // Use app-specific password
      }
    });

    const mailOptions = {
      from: 'srivastavavansh64@gmail.com',
      to: 'srivastavavansh64@gmail.com',             // Receiver
      subject: 'New Screenshot Submission',
      text: 'Screenshot attached.',
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    fs.unlinkSync(req.file.path); // Clean up uploaded file

    res.json({ message: 'Screenshot sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send screenshot.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
