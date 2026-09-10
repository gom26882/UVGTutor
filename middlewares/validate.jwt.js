'use strict'

import jwt from 'jsonwebtoken'
import { findUser } from '../helpers/db.validator.js'

export const validateJwt = async (req, res, next) => {
    try {
        const secretKey = process.env.SECRET_KEY
        const { authorization } = req.headers

        if (!authorization) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized - Token required'
            })
        }

        const token = authorization.startsWith('Bearer ')
            ? authorization.split(' ')[1]
            : authorization

        const decoded = jwt.verify(token, secretKey)

        const usuario = await findUser(decoded.uid)

        if (!usuario) {
            return res.status(404).send({
                success: false,
                message: 'User not found - Unauthorized'
            })
        }

        req.user = {
            id: usuario._id,
            nombre: usuario.nombre,
            correo: usuario.correo
        }

        next()

    } catch (err) {
        console.error(err)

        return res.status(401).send({
            success: false,
            message: 'Invalid token or expired'
        })
    }
}