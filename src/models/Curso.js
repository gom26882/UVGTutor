import mongoose from 'mongoose'

const cursoSchema = new mongoose.Schema(
    {
        codigo: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        nombre: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        versionKey: false
    }
)

cursoSchema.statics.getAllCursos = async function() {
    return await this.find()
}

cursoSchema.statics.getCursoById = async function(id) {
    return await this.findById(id)
}

cursoSchema.methods.updateCurso = function(codigo, nombre) {
    this.codigo = codigo
    this.nombre = nombre
}

cursoSchema.statics.deleteCursoById = async function(id) {
    return await this.findByIdAndDelete(id)
}

const Curso = mongoose.model('Curso', cursoSchema)

export default Curso