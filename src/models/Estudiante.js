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
    {
        versionKey: false
    }
)


estudianteSchema.statics.getEstudianteById = async function(id) {
    return await this.findById(id).populate('cursos')
}

estudianteSchema.statics.getAllEstudiantes = async function() {
    return await this.find().populate('cursos')
}

estudianteSchema.methods.agregarCurso = function(cursoId) {
    if (!this.cursos.includes(cursoId)) {
        this.cursos.push(cursoId)
    }
}

estudianteSchema.methods.eliminarCurso = function(cursoId) {
    this.cursos = this.cursos.filter(
        curso => curso.toString() !== cursoId.toString()
    )
}

const Estudiante = Usuario.discriminator(
    'Estudiante',
    estudianteSchema
)

export default Estudiante