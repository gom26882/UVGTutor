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
import { isEstudiante, isTutor, isEstudianteOrTutor } from '../../middlewares/validate.role.js'
import { tutoriaValidator, motivoValidator } from '../../helpers/validators.js'

const router = Router()

//estudiante
router.post(
    '/solicitar',
    validateJwt,
    isEstudiante,
    tutoriaValidator,
    solicitarTutoria
)

router.get(
    '/estudiante',
    validateJwt,
    isEstudiante,
    getTutoriasByEstudiante
)

//tutor
router.get(
    '/tutor',
    validateJwt,
    isTutor,
    getTutoriasByTutor
)

router.put(
    '/aceptar/:id',
    validateJwt,
    isTutor,
    aceptarTutoria
)

router.put(
    '/rechazar/:id',
    validateJwt,
    isTutor,
    motivoValidator,
    rechazarTutoria
)

router.put(
    '/completar/:id',
    validateJwt,
    isTutor,
    completarTutoria
)

//publicas
router.put(
    '/cancelar/:id',
    validateJwt,
    isEstudianteOrTutor,
    motivoValidator,
    cancelarTutoria
)

router.get(
    '/:id',
    validateJwt,
    isEstudianteOrTutor,
    getTutoriaById
)

export default router
