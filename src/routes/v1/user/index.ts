import { Router } from 'express';
import readRoute from './read';
import addRoute from './create';
import updateRoute from './update';
import deleteRoute from './delete';
import requestResetPasswordRoute from './requestResetPassword';
import resetPasswordRoute from './resetPassword';

const router: Router = Router();
// Add sub-routes
readRoute(router);
addRoute(router);
updateRoute(router);
deleteRoute(router);
resetPasswordRoute(router);
requestResetPasswordRoute(router);

export default router;
