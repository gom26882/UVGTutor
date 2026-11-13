import { Router } from 'express'
import {
    getAllEstudiantes,
    getEstudianteById,
    getMiPerfil,
    agregarCurso,
    eliminarCurso
} from '../controllers/estudiante.controller.js'

import { validateJwt } from '../../middlewares/validate.jwt.js'
import { isEstudiante, isTutor } from '../../middlewares/validate.role.js'


const router = Router()

router.get(
    '/profile',
    validateJwt,
    isEstudiante,
    getMiPerfil
)

router.get(
    '/getAllEstudiantes',
    validateJwt,
    isTutor,
    getAllEstudiantes
)

router.get(
    '/getEstudiante/:id',
    validateJwt,
    getEstudianteById
)

router.post(
    '/:estudianteId/addCurso/:cursoId',
    validateJwt,
    isEstudiante,
    agregarCurso
)

router.delete(
    '/:estudianteId/deleteCurso/:cursoId',
    validateJwt,
    isEstudiante,
    eliminarCurso
)


export default router
