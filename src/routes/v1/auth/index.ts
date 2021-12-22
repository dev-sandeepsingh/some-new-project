import { Router } from 'express';
import loginRoute from './login';

const router: Router = Router();
// Add sub-routes
loginRoute(router);

export default router;
