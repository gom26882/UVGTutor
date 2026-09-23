import mongoose from 'mongoose'
import Usuario from './Usuario.js'

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
            enum: ['PRESENCIAL', 'VIRTUAL']
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
    },
    {
        versionKey: false
    }
)

tutorSchema.statics.getAllTutores = async function() {
    return await this.find().populate('cursos')
}

tutorSchema.statics.getTutorById = async function(id) {
    return await this.findById(id).populate('cursos')
}

tutorSchema.methods.updateTutor = function(experiencia, precioHora, modalidad) {
    if (experiencia !== undefined) this.experiencia = experiencia
    if (precioHora !== undefined) this.precioHora = precioHora
    if (modalidad !== undefined) this.modalidad = modalidad
}

tutorSchema.methods.agregarCurso = function(cursoId) {
    const existe = this.cursos.some(
        curso => curso.toString() === cursoId.toString()
    )

    if (!existe) {
        this.cursos.push(cursoId)
    }
}

tutorSchema.methods.eliminarCurso = function(cursoId) {
    this.cursos = this.cursos.filter(
        curso => curso.toString() !== cursoId.toString()
    )
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