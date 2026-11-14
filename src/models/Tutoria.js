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
    },

    detalles: {
        type: String,
        trim: true,
        default: ''
    },

    motivoRechazo: {
        type: String,
        trim: true
    },

    mensajeRechazo: {
        type: String,
        trim: true
    },

    motivoCancelacion: {
        type: String,
        trim: true
    },

    mensajeCancelacion: {
        type: String,
        trim: true
    },

    canceladaPor: {
        type: String,
        enum: ['Estudiante', 'Tutor']
    }
}, {
    timestamps: true
})

tutoriaSchema.statics.getTutoriaById = async function(id) {
    if (!mongoose.isValidObjectId(id)) return null
    return await this.findById(id)
}

tutoriaSchema.statics.getConfirmadasDeTutor = async function(tutorId, excluirId = null) {
    const filtro = {
        tutor: tutorId,
        estado: ESTADO_TUTORIA.ACEPTADA,
        fecha: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }
    if (excluirId) filtro._id = { $ne: excluirId }
    return await this.find(filtro).select('fecha cantidadHoras tutor')
}

tutoriaSchema.statics.getConfirmadasPorTutor = async function() {
    const tutorias = await this.find({
        estado: ESTADO_TUTORIA.ACEPTADA,
        fecha: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).select('fecha cantidadHoras tutor')

    return tutorias.reduce((mapa, tutoria) => {
        const clave = tutoria.tutor.toString()
        ;(mapa[clave] = mapa[clave] || []).push(tutoria)
        return mapa
    }, {})
}

tutoriaSchema.statics.getTutoriasByEstudiante = async function(estudianteId) {
    return await this.find({estudiante: estudianteId})
        .populate('tutor', 'nombre correo modalidad precioHora telefono fotoPerfil')
        .populate('curso')
        .sort({fecha: -1})
}

tutoriaSchema.statics.getTutoriasByTutor = async function(tutorId) {
    return await this.find({tutor: tutorId})
        .populate('estudiante', 'nombre correo carnet telefono fotoPerfil')
        .populate('curso')
        .sort({fecha: -1})
}

tutoriaSchema.methods.aceptarTutoria = function() {
    if (this.estado !== ESTADO_TUTORIA.PENDIENTE) return false

    this.estado = ESTADO_TUTORIA.ACEPTADA
    return true
}

tutoriaSchema.methods.rechazarTutoria = function(motivo, mensaje) {
    if (this.estado !== ESTADO_TUTORIA.PENDIENTE) return false

    this.estado = ESTADO_TUTORIA.RECHAZADA
    if (motivo) this.motivoRechazo = motivo
    if (mensaje) this.mensajeRechazo = mensaje
    return true
}

tutoriaSchema.methods.cancelarTutoria = function(canceladaPor, motivo, mensaje) {
    if (
        this.estado !== ESTADO_TUTORIA.PENDIENTE &&
        this.estado !== ESTADO_TUTORIA.ACEPTADA
    ) return false

    this.estado = ESTADO_TUTORIA.CANCELADA
    if (canceladaPor) this.canceladaPor = canceladaPor
    if (motivo) this.motivoCancelacion = motivo
    if (mensaje) this.mensajeCancelacion = mensaje
    return true
}

tutoriaSchema.methods.completarTutoria = function() {
    if (this.estado !== ESTADO_TUTORIA.ACEPTADA) return false

    this.estado = ESTADO_TUTORIA.COMPLETADA
    return true
}

const Tutoria = mongoose.model('Tutoria', tutoriaSchema)

export default Tutoria