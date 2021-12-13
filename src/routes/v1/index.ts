import { Router } from 'express';

import userData from './userData';

const router = Router();

router.use('/users', userData);

export default router;
