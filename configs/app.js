'use strict'

import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

import { limiter } from '../middlewares/rate.limit.js'
import authRoutes from '../src/routes/auth.routes.js'
import usuarioRoutes from '../src/routes/usuario.routes.js'
import cursoRoutes from '../src/routes/curso.routes.js'
import estudianteRoutes from '../src/routes/estudiante.routes.js'

const configs = (app) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors())
    app.use(helmet())
    app.use(limiter)
    app.use(morgan('dev'))
}

const routes = (app) => {
    app.use('/v1/auth', authRoutes)
    app.use('/v1/user', usuarioRoutes)
    app.use('/v1/curso', cursoRoutes)
    app.use('/v1/estudiante', estudianteRoutes)
}

export const initServer = () => {
    const app = express()

    try {
        configs(app)
        routes(app)

        app.listen(process.env.PORT, () => {
            console.log(`Server | running on port ${process.env.PORT}`)
        })

    } catch (err) {
        console.error('Server init failed', err)
    }
}