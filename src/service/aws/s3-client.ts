import * as AWS from 'aws-sdk';

const config = new AWS.Config({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_DEFAULT_REGION,
});

const s3Client = new AWS.S3(config);

export default s3Client;
