import { validationResult, matchedData } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import HttpException from './exceptions/HttpException';

export const validateInput = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        req.body = matchedData(req, { locations: ['body'] });
        next();
        return;
    }

    throw new HttpException(422, 'Validation error', errors.array());
};
