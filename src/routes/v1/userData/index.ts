import { Router } from 'express';
import readRoute from './read';
import addRoute from './create';
import updateRoute from './update';
import deleteRoute from './delete';

const router = Router();
// Add sub-routes
router.use('/userData', readRoute);
router.use('/userData', addRoute);
router.use('/userData', updateRoute);
router.use('/userData', deleteRoute);

export default router;
