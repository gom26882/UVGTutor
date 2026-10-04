import { body } from 'express-validator'
import { validateErrors } from './validate.errors.js'
import { existEmail, existCodigoCurso, existCarnet } from './db.validator.js'

export const registerValidator = [
    body('nombre').notEmpty().withMessage('El nombre no puede estar vacío'),
    body('correo').notEmpty().withMessage('El correo no puede estar vacío').isEmail()
        .withMessage('El correo no es válido').custom(existEmail),
    body('contrasena').notEmpty() .withMessage('La contraseña no puede estar vacía')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('tipoUsuario')
        .notEmpty().withMessage('El tipo de usuario no puede estar vacío')
        .isIn(['Estudiante', 'Tutor']).withMessage('El tipo de usuario debe ser Estudiante o Tutor'),
    body('carnet')
        .if(body('tipoUsuario').equals('Estudiante')).trim().notEmpty()
        .withMessage('El carnet no puede estar vacío').isLength({ min: 5, max: 5 })
        .withMessage('El carnet debe tener 5 caracteres').custom(existCarnet),
    body('experiencia').if(body('tipoUsuario').equals('Tutor')).trim().notEmpty()
        .withMessage('La experiencia no puede estar vacía'),
    body('precioHora').if(body('tipoUsuario').equals('Tutor')).notEmpty().withMessage('El precio por hora no puede estar vacío')
        .isFloat({ min: 0 }).withMessage('El precio por hora debe ser mayor o igual a 0'),
    body('modalidad').if(body('tipoUsuario').equals('Tutor')).notEmpty().withMessage('La modalidad no puede estar vacía')
        .isIn(['PRESENCIAL', 'VIRTUAL']).withMessage('La modalidad debe ser PRESENCIAL o VIRTUAL'),
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
export const tutorValidator = [
    body('experiencia').trim().notEmpty().withMessage('La experiencia no puede estar vacía'),
    body('precioHora').notEmpty().withMessage('El precio por hora no puede estar vacío').isFloat({ min: 0 })
        .withMessage('El precio por hora debe ser mayor o igual a 0'),
    body('modalidad').notEmpty().withMessage('La modalidad no puede estar vacía').isIn(['PRESENCIAL', 'VIRTUAL'])
        .withMessage('La modalidad debe ser PRESENCIAL o VIRTUAL'),
    validateErrors
]

export const updateTutorValidator = [
    body('experiencia').optional().trim().notEmpty().withMessage('La experiencia no puede estar vacía'),
    body('precioHora').optional().isFloat({ min: 0 }).withMessage('El precio por hora debe ser mayor o igual a 0'),
    body('modalidad').optional().isIn(['PRESENCIAL', 'VIRTUAL']).withMessage('La modalidad debe ser PRESENCIAL o VIRTUAL'),
    validateErrors
]

export const horarioValidator = [
    body('horario').notEmpty().withMessage('El horario no puede estar vacío').isISO8601().withMessage('El horario debe ser una fecha válida'),
    validateErrors
]