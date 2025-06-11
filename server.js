const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

app.post('/upload', upload.single('screenshot'), async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'srivastavavansh64@gmail.com',         // Replace with your Gmail
        pass: 'VITChennai$123'             // Use app-specific password
      }
    });

    const mailOptions = {
      from: 'srivastavavansh64@gmail.com',
      to: 'srivastavavansh64@gmail.com',             // Same or any other address
      subject: 'New Screenshot Submission',
      text: 'Screenshot attached.',
      attachments: [{
        filename: req.file.originalname,
        path: req.file.path
      }]
    };

    await transporter.sendMail(mailOptions);

    fs.unlinkSync(req.file.path); // Clean up

    res.json({ message: 'Screenshot sent successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send screenshot.' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
