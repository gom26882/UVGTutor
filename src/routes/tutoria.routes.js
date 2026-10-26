import { Router } from 'express'

import {
    solicitarTutoria,
    getTutoriaById,
    getTutoriasByEstudiante,
    getTutoriasByTutor,
    aceptarTutoria,
    rechazarTutoria,
    cancelarTutoria,
    completarTutoria,
} from '../controllers/tutoria.controller.js'

import { validateJwt } from '../../middlewares/validate.jwt.js'
import { tutoriaValidator, updateTutorValidator} from '../../helpers/validators.js'

const router = Router()

router.post(
    '/solicitar',
    validateJwt,
    tutoriaValidator,
    solicitarTutoria
)

router.get(
    '/estudiante',
    validateJwt,
    getTutoriasByEstudiante
)

router.get(
    '/tutor',
    validateJwt,
    getTutoriasByTutor
)

router.get(
    '/:id',
    validateJwt,
    getTutoriaById
)

router.put(
    '/aceptar/:id',
    validateJwt,
    aceptarTutoria
)

router.put(
    '/rechazar/:id',
    validateJwt,
    rechazarTutoria
)

router.put(
    '/cancelar/:id',
    validateJwt,
    cancelarTutoria
)

router.put(
    '/completar/:id',
    validateJwt,
    completarTutoria
)

export default router