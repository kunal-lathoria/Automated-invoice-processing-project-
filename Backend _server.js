const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const { processWithPythonML } = require('./ml-integration');

const app = express();
const s3 = new AWS.S3();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/process-invoice', upload.array('invoices'), async (req, res) => {
  const files = req.files;
  const processingPromises = files.map(file => {
    const s3Params = {
      Bucket: process.env.INVOICE_BUCKET,
      Key: `uploads/${Date.now()}-${file.originalname}`,
      Body: file.buffer
    };
    return s3.upload(s3Params).promise()
      .then(s3Data => processWithPythonML(s3Data.Location));
  });
  const results = await Promise.all(processingPromises);
  res.json({ success: true, data: results });
});

app.listen(3000, () => console.log('Server running'));
