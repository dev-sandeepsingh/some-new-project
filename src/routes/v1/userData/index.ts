import { Router } from 'express';
import readRoute from './read';
import addRoute from './create';
import updateRoute from './update';
import deleteRoute from './delete';

const router: Router = Router();
// Add sub-routes
readRoute(router);
addRoute(router);
updateRoute(router);
deleteRoute(router);

export default router;
