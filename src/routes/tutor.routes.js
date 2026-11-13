import { Router } from 'express'

import {
    getAllTutores,
    getTutorById,
    updateTutor,
    agregarCurso,
    eliminarCurso,
    agregarHorario,
    eliminarHorario,
    getTutoresByModalidad,
    getTutorPublicoById
} from '../controllers/tutor.controller.js'

import { validateJwt } from '../../middlewares/validate.jwt.js'
import { isEstudiante, isTutor } from '../../middlewares/validate.role.js'

import {
    updateTutorValidator,
    horarioValidator,
    modalidadValidator
} from '../../helpers/validators.js'


const router = Router()

// estudiante
router.get(
    '/getAllTutores',
    validateJwt,
    isEstudiante,
    getAllTutores
)

// tutor
router.get(
    '/profile',
    validateJwt,
    isTutor,
    getTutorById
)

router.put(
    '/profile',
    validateJwt,
    isTutor,
    updateTutorValidator,
    updateTutor
)

router.post(
    '/curso/:cursoId',
    validateJwt,
    isTutor,
    agregarCurso
)

router.delete(
    '/curso/:cursoId',
    validateJwt,
    isTutor,
    eliminarCurso
)

router.post(
    '/horario',
    validateJwt,
    isTutor,
    horarioValidator,
    agregarHorario
)

router.delete(
    '/horario',
    validateJwt,
    isTutor,
    horarioValidator,
    eliminarHorario
)

// publicas
router.get(
    '/modalidad/:modalidad',
    validateJwt,
    isEstudiante,
    modalidadValidator,
    getTutoresByModalidad
)

router.get(
    '/:id',
    validateJwt,
    isEstudiante,
    getTutorPublicoById
)

export default router
