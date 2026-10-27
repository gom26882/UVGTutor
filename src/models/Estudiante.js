import mongoose from 'mongoose'
import Usuario from './Usuario.js'

const estudianteSchema = new mongoose.Schema(
    {
        carnet: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        cursos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Curso'
            }
        ]
    },
)


estudianteSchema.statics.getEstudianteById = async function(id) {
    return await this.findById(id).populate('cursos')
}

estudianteSchema.statics.getAllEstudiantes = async function() {
    return await this.find().populate('cursos')
}

estudianteSchema.methods.agregarCurso = function(cursoId) {
    const cursoExiste = this.cursos.some(curso => {
        const id = curso._id ? curso._id.toString() : curso.toString()

        return id === cursoId.toString()
    })

    if (cursoExiste) {
        return false
    }

    this.cursos.push(cursoId)

    return true
}

estudianteSchema.methods.eliminarCurso = function(cursoId) {
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

const Estudiante = Usuario.discriminator(
    'Estudiante',
    estudianteSchema
)

export default Estudiante