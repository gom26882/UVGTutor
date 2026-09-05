import { body } from 'express-validator'
import { validateErrors } from './validate.errors.js'
import { existEmail } from './db.validator.js'

export const registerValidator = [
    body('nombre').notEmpty().withMessage('El nombre no puede estar vacío'),
    body('correo').notEmpty().withMessage('El correo no puede estar vacío').isEmail()
        .withMessage('El correo no es válido').custom(existEmail),
    body('contrasena').notEmpty() .withMessage('La contraseña no puede estar vacía')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    validateErrors
]

export const loginValidator = [
    body('correo').notEmpty().withMessage('El correo no puede estar vacío').isEmail().withMessage('El correo no es válido'),
    body('contrasena').notEmpty().withMessage('La contraseña no puede estar vacía'),
    validateErrors
]