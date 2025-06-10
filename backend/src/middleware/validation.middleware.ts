import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(( err) => ({
            param: err.type,
            message: err.msg
        }));
        return res.status(400).json({ errors: formattedErrors });
    }

    next();
};