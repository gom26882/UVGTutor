import { Router } from 'express'

import {
    getAllTutores,
    getTutorById,
    updateTutor,
    agregarCurso,
    eliminarCurso,
    agregarHorario,
    eliminarHorario
} from '../controllers/tutor.controller.js'

import { validateJwt } from '../../middlewares/validate.jwt.js'

import {
    updateTutorValidator,
    horarioValidator
} from '../../helpers/validators.js'


const router = Router()

router.get(
    '/',
    validateJwt,
    getAllTutores
)

router.get(
    '/profile',
    validateJwt,
    getTutorById
)

router.put(
    '/profile',
    validateJwt,
    updateTutorValidator,
    updateTutor
)

router.post(
    '/curso/:cursoId',
    validateJwt,
    agregarCurso
)

router.delete(
    '/curso/:cursoId',
    validateJwt,
    eliminarCurso
)

router.post(
    '/horario',
    validateJwt,
    horarioValidator,
    agregarHorario
)

router.delete(
    '/horario',
    validateJwt,
    horarioValidator,
    eliminarHorario
)

export default router