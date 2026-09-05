import Usuario from '../src/models/Usuario.js'

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