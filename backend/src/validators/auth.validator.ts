import { body, param } from 'express-validator';

export const registerValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one digit')
        .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character')
];

export const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address'),

    body('password')
        .notEmpty().withMessage('Password is required')
];


export const updateValidation = [
    body('username').optional()
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),

    body('email').optional()
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),

    body('password').optional()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one digit')
        .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character'),
    
    param('id')
    .isMongoId().withMessage('Invalid User ID format')
];

export const getUserValidation = [
    param('id')
    .isMongoId().withMessage('Invalid User ID format')
];

export const deleteUserValidation = [
    param('id')
    .isMongoId().withMessage('Invalid User ID format')
];