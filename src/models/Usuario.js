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
        },

        telefono: {
            type: String,
            trim: true,
            default: '',
            set: valor => String(valor || '').replace(/\D/g, '')
        },

        fotoPerfil: {
            type: String,
            default: '',
            maxlength: 700000
        }
    },
    {
        timestamps: true,
        discriminatorKey: 'tipoUsuario'
    }
)

usuarioSchema.methods.actualizarPerfil = function(
    nombre,
    correo,
    telefono,
    fotoPerfil
) {
    this.nombre = nombre;
    this.correo = correo;

    if (telefono !== undefined) {
        this.telefono = telefono;
    }

    if (fotoPerfil !== undefined) {
        this.fotoPerfil = fotoPerfil;
    }
}

usuarioSchema.statics.getUserById = async function(id) {
    return await this.findById(id)
}

usuarioSchema.methods.updateUser = function(nombre, correo) {
    this.nombre = nombre
    this.correo = correo
}

const Usuario = mongoose.model('Usuario', usuarioSchema)

export default Usuario