import mongoose from 'mongoose'

const usuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },

        correo: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        contrasena: {
            type: String,
            required: true,
            select: false
        }
    },
    {
        timestamps: true
    }
)

usuarioSchema.methods.actualizarPerfil = function(nombre, correo) {
    this.nombre = nombre
    this.correo = correo
}

usuarioSchema.methods.getId = function() {
    return this._id.toString()
}

usuarioSchema.methods.getNombre = function() {
    return this.nombre
}

usuarioSchema.methods.getCorreo = function() {
    return this.correo
}

const Usuario = mongoose.model('Usuario', usuarioSchema)

export default Usuario