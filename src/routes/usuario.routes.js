import { Router } from 'express'

import { getUserById, updateUser } from '../controllers/usuario.controller.js'
import { updateProfileValidator } from '../../helpers/validators.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'

const router = Router()

router.get(
    '/getUser',
    validateJwt,
    getUserById
)

router.put(
    '/updateUser',
    validateJwt,
    updateProfileValidator,
    updateUser
)

export default router