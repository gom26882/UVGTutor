'use strict'

const permitirRoles = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({
            success: false,
            message: 'Unauthorized - Token required'
        })
    }

    if (!roles.includes(req.user.tipoUsuario)) {
        return res.status(403).send({
            success: false,
            message: `Acceso denegado: solo para: ${roles.join(' o ')}`
        })
    }

    next()
}

export const isEstudiante = permitirRoles('Estudiante')
export const isTutor = permitirRoles('Tutor')
export const isEstudianteOrTutor = permitirRoles('Estudiante', 'Tutor')
