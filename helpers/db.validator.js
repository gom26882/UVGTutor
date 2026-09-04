import Usuario from '../src/models/Usuario.js'

// export const existEmail = async (email) => {
//     const usuario = await Usuario.findOne({ correo: email })

//     if (usuario) {
//         throw new Error(`El correo ${email} ya está registrado`)
//     }
// }

// export const findUser = async (id) => {
//     try {
//         const usuario = await Usuario.findById(id)

//         if (!usuario) {
//             return false
//         }

//         return usuario

//     } catch (err) {
//         console.error(err)
//         return false
//     }
// }