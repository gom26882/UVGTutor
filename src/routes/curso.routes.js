import { Router } from 'express'

import {
    createCurso,
    getAllCursos,
    getCursoById,
    updateCurso,
    deleteCurso
} from '../controllers/curso.controller.js'

import { validateJwt } from '../../middlewares/validate.jwt.js'

import {
    cursoValidator,
    updateCursoValidator
} from '../../helpers/validators.js'


const router = Router()

router.post(
    '/addCurso',
    validateJwt,
    cursoValidator,
    createCurso
)

router.get(
    '/getAllCursos',
    validateJwt,
    getAllCursos
)

router.get(
    '/getCurso/:id',
    validateJwt,
    getCursoById
)

router.put(
    '/updateCurso/:id',
    validateJwt,
    updateCursoValidator,
    updateCurso
)

router.delete(
    '/deleteCurso/:id',
    validateJwt,
    deleteCurso
)


export default router