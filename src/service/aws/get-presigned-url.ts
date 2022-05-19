import * as util from 'util';
import s3Client from './s3-client';
import catchAsync from '../../utils/catchAsync';
import logger from '../logger';

const bucketName = process.env.S3_BUCKET_PATH;

interface CreatePresignedUrlI {
  key: string;
  fileName: string;
  presignedUrl: string;
}

type GetSignedUrlWithParams = (
  operation: string,
  params: any,
  callback: (err: Error, url: string) => void,
) => void;

const getSignedUrl = util.promisify(
  s3Client.getSignedUrl.bind(s3Client) as GetSignedUrlWithParams,
);

export const testableRefs = {
  getSignedUrl,
};

const getPresignedUrl: (
  directory: string,
  fileName: string,
) => Promise<CreatePresignedUrlI> = async (directory, fileName) =>
  catchAsync(
    async () => {
      const key = `${directory}/${fileName}`;
      const presignedUrl = await testableRefs.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: key,
        Expires: 10 * 60,
        ACL: 'public-read',
        ContentDisposition: 'attachment',
      });
      return { key, fileName, presignedUrl };
    },
    (error) => {
      logger(
        'error',
        `/service/s3/getPresignedUrl: Error ${error} when creating presigned url`,
        error.stack,
      );

      throw error;
    },
  )();

export default getPresignedUrl;
