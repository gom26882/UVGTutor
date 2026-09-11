import Usuario from '../src/models/Usuario.js'
import Curso from '../src/models/Curso.js'

export const existEmail = async (correo) => {
    const usuarioExistente = await Usuario.findOne({ correo })

    if (usuarioExistente) {
        throw new Error(`El correo ${correo} ya está registrado`)
    }
}

export const findUser = async (id) => {
    try {
        const usuario = await Usuario.findById(id)

        if (!usuario) {
            return false
        }

        return usuario
    } catch (err) {
        console.error(err)
        return false
    }
}

export const existCodigoCurso = async (codigo) => {
    const cursoExistente = await Curso.findOne({ codigo })

    if (cursoExistente) {
        throw new Error(`El código ${codigo} ya está registrado`)
    }
}