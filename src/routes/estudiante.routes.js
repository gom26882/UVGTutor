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
    '/',
    validateJwt,
    getAllEstudiantes
)

router.get(
    '/profile',
    validateJwt,
    getEstudianteById
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


export default router