/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import logger from '../../../service/logger';
import { setCustomTransactionName } from '../../../service/newrelic';
import catchAsync from '../../../utils/catchAsync';
import HttpException from '../../../utils/exceptions/HttpException';
import authenticateUser from '../../../service/user/authenticate';
import { body } from 'express-validator';
import { validateInput } from '../../../utils/validateInput';
import * as jwt from 'jsonwebtoken'
import jwtSign from '../../../utils/jwtSign';

export const testableRefs = {
    authenticateUser,
};

const route: (route: Router) => void = (router) => {
    setCustomTransactionName('/v1/auth/login');
    router.post('/login',
        [
            body('email').isEmail(),
            body('password').notEmpty(),
        ],
        validateInput,
        async (req, res, next) => {
            catchAsync(
                async () => {
                    const { password, email } = req.body;
                    const user = await testableRefs.authenticateUser(email, password);

                    if (!user) {
                        throw new HttpException(404, 'Invalid email or password');
                    }

                    res.status(200).type('application/json').send({
                        success: true,
                        token: jwtSign({ userId: user.id, email }),
                    });
                },
                async (error) => {
                    logger('error', `/v1/auth/login: Error ${error}`, error?.stack);
                    if (error instanceof HttpException) {
                        next(error);
                    }
                    next(new HttpException(403, error.message));
                },
            )();
        });
};

export default route;
