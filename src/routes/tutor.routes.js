import { Router } from 'express'

import {
    getAllTutores,
    getTutorById,
    updateTutor,
    agregarCurso,
    eliminarCurso,
    agregarHorario,
    eliminarHorario,
    getTutoresByModalidad
} from '../controllers/tutor.controller.js'

import { validateJwt } from '../../middlewares/validate.jwt.js'

import {
    updateTutorValidator,
    horarioValidator,
    modalidadValidator
} from '../../helpers/validators.js'


const router = Router()

router.get(
    '/getAllTutores',
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

router.get(
    '/modalidad/:modalidad',
    validateJwt,
    modalidadValidator,
    getTutoresByModalidad
)

export default router