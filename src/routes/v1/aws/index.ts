import { Router } from 'express';
import getPresignedUrlRoute from './get-presigned-url';

const router: Router = Router();
// Add sub-routes
getPresignedUrlRoute(router);

export default router;
