'use strict'

import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

import { limiter } from '../middlewares/rate.limit.js'

const configs = (app) => {
    app.use(express.json())

    app.use(express.urlencoded({
        extended: true
    }))

    app.use(cors())
    app.use(helmet())
    app.use(limiter)
    app.use(morgan('dev'))
}

export const initServer = async () => {
    const app = express()

    try {
        configs(app)

        app.get('/', (req, res) => {
            res.status(200).send({
                success: true,
                message: 'UVGTutor API funcionando'
            })
        })

        const port = process.env.PORT || 3000

        app.listen(port, () => {
            console.log(`Server | running on port ${port}`)
        })

    } catch (err) {
        console.error('Server | initialization failed', err)
        throw err
    }
}