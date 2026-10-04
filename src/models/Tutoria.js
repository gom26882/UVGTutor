import mongoose from 'mongoose'

import { MODALIDAD } from '../../constants/modalidad.js'
import { ESTADO_TUTORIA } from '../../constants/estadoTutoria.js'

const tutoriaSchema = new mongoose.Schema({
    estudiante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estudiante',
        required: true
    },

    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true
    },

    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curso',
        required: true
    },

    fecha: {
        type: Date,
        required: true
    },

    cantidadHoras: {
        type: Number,
        required: true,
        min: 1
    },

    modalidad: {
        type: String,
        required: true,
        enum: Object.values(MODALIDAD)
    },

    estado: {
        type: String,
        enum: Object.values(ESTADO_TUTORIA),
        default: ESTADO_TUTORIA.PENDIENTE
    },

    precioTotal: {
        type: Number,
        required: true,
        min: 0
    }
})

tutoriaSchema.statics.getTutoriaById = async function(id) {
    return await this.findById(id)
}

tutoriaSchema.statics.getTutoriasByEstudiante = async function(estudianteId) {
    return await this.find({estudiante: estudianteId})
        .populate('tutor')
        .populate('curso')
}

tutoriaSchema.statics.getTutoriasByTutor = async function(tutorId) {
    return await this.find({tutor: tutorId})
        .populate('estudiante')
        .populate('curso')
}

tutoriaSchema.methods.aceptarTutoria = function() {
    if (this.estado !== ESTADO_TUTORIA.PENDIENTE) return false

    this.estado = ESTADO_TUTORIA.ACEPTADA
    return true
}

tutoriaSchema.methods.rechazarTutoria = function() {
    if (this.estado !== ESTADO_TUTORIA.PENDIENTE) return false

    this.estado = ESTADO_TUTORIA.RECHAZADA
    return true
}

tutoriaSchema.methods.cancelarTutoria = function() {
    if (
        this.estado !== ESTADO_TUTORIA.PENDIENTE &&
        this.estado !== ESTADO_TUTORIA.ACEPTADA
    ) return false

    this.estado = ESTADO_TUTORIA.CANCELADA
    return true
}

tutoriaSchema.methods.completarTutoria = function() {
    if (this.estado !== ESTADO_TUTORIA.ACEPTADA) return false

    this.estado = ESTADO_TUTORIA.COMPLETADA
    return true
}

const Tutoria = mongoose.model('Tutoria', tutoriaSchema)

export default Tutoria