import { body } from 'express-validator'
import { validateErrors } from './validate.errors.js'
import { existEmail, existCodigoCurso, existCarnet } from './db.validator.js'

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

export const updateProfileValidator = [
    body('nombre').notEmpty().withMessage('El nombre no puede estar vacío'),
    body('correo').notEmpty().withMessage('El correo no puede estar vacío').isEmail().withMessage('El correo no es válido'),
    validateErrors
]

export const cursoValidator = [
    body('codigo').notEmpty().withMessage('El código del curso no puede estar vacío').custom(existCodigoCurso),
    body('nombre').notEmpty().withMessage('El nombre del curso no puede estar vacío'),
    validateErrors
]

export const updateCursoValidator = [
    body('codigo').optional().trim().notEmpty().withMessage('El código del curso no puede estar vacío'),
    body('nombre').optional().trim().notEmpty().withMessage('El nombre del curso no puede estar vacío'),
    validateErrors
]

export const estudianteValidator = [
    body('carnet').trim().notEmpty().withMessage('El carnet no puede estar vacío').isLength({ min: 5, max: 7 }).withMessage('El carnet debe tener 5 caracteres').custom(existCarnet),
    validateErrors
]