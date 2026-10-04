import { Router } from 'express'

import {
    getAllEstudiantes,
    getEstudianteById,
    agregarCurso,
    eliminarCurso
} from '../controllers/estudiante.controller.js'

import { validateJwt } from '../../middlewares/validate.jwt.js'


const router = Router()

router.get(
    '/getAllEstudiantes',
    validateJwt,
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
    agregarCurso
)

router.delete(
    '/:estudianteId/deleteCurso/:cursoId',
    validateJwt,
    eliminarCurso
)


export default router