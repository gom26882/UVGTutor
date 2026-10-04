import mongoose from 'mongoose'
import Usuario from './Usuario.js'
import { MODALIDAD } from '../utils/constants.js'

const tutorSchema = new mongoose.Schema(
    {
        experiencia: {
            type: String,
            required: true,
            trim: true
        },

        precioHora: {
            type: Number,
            required: true,
            min: 0
        },

        modalidad: {
            type: String,
            required: true,
            enum: Object.values(MODALIDAD)
        },

        cursos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Curso'
            }
        ],

        horariosDisponibles: [
            {
                type: Date
            }
        ]
    }
)

tutorSchema.statics.getAllTutores = async function() {
    return await this.find().populate('cursos')
}

tutorSchema.statics.getTutorById = async function(id) {
    return await this.findById(id)
}

tutorSchema.methods.updateTutor = function(experiencia, precioHora, modalidad) {
    if (experiencia !== undefined) this.experiencia = experiencia
    if (precioHora !== undefined) this.precioHora = precioHora
    if (modalidad !== undefined) this.modalidad = modalidad
}

tutorSchema.methods.agregarCurso = function(cursoId) {
    const cursoExiste = this.cursos.some(
        curso => curso.equals(cursoId)
    )

    if (cursoExiste) {
        return false
    }

    this.cursos.push(cursoId)

    return true
}

tutorSchema.methods.eliminarCurso = function(cursoId) {
    const cursoExiste = this.cursos.some(
        curso => curso.equals(cursoId)
    )

    if (!cursoExiste) {
        return false
    }

    this.cursos = this.cursos.filter(
        curso => !curso.equals(cursoId)
    )

    return true
}

tutorSchema.methods.agregarHorario = function(horario) {
    this.horariosDisponibles.push(horario)
}

tutorSchema.methods.eliminarHorario = function(horario) {
    const fecha = new Date(horario).getTime()

    this.horariosDisponibles = this.horariosDisponibles.filter(
        disponible => disponible.getTime() !== fecha
    )
}

tutorSchema.methods.estaDisponible = function(horario) {
    const fecha = new Date(horario).getTime()

    return this.horariosDisponibles.some(
        disponible => disponible.getTime() === fecha
    )
}


const Tutor = Usuario.discriminator(
    'Tutor',
    tutorSchema
)

export default Tutor