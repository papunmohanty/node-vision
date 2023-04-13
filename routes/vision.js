const AWS = require('aws-sdk');
const router = require('express').Router();
let dotenv = require('dotenv').config()

router.post('/classify', function(req, res, next) {
  // Check if file was uploaded
  if (!req.files || !req.files.file) {
    return res.status(400).json({error: 'File not found'});
  }

  // Read image file from request buffer
  const image = req.files.file.data;

  AWS.config.credentials = new AWS.Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-southeast-1'
  });

  // Initialize AWS Rekognition client
  const rekognition = new AWS.Rekognition({
    region: 'ap-southeast-1'
  });

  // Call AWS Rekognition API to detect labels in image
  rekognition.detectLabels({
    Image: {
      Bytes: image
    }
  }, function(err, data) {
    if (err) {
      console.log(err);
      return res.status(500).json({error: 'Unable to process the request'});
    }

    // Extract labels from API response
    const labels = data.Labels.map(label => label.Name);

    // Return labels in response
    return res.json({labels: labels});
  });
});

module.exports = router;
