import Usuario  from "../models/Usuario.js"
import Estudiante from "../models/Estudiante.js"
import { encrypt, checkPassword } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'

export const register = async (req, res) => {
    try {
        const {
            nombre,
            correo,
            contrasena,
            tipoUsuario,
            carnet
        } = req.body

        const contrasenaEncriptada = await encrypt(contrasena)

        let usuario

        if (tipoUsuario === 'Estudiante') {

            usuario = new Estudiante({nombre, correo, contrasena: contrasenaEncriptada, carnet })

        } else {

            usuario = new Usuario({ nombre, correo, contrasena: contrasenaEncriptada })
        }

        await usuario.save()

        return res.status(201).send({
            success: true,
            message: 'Usuario registrado correctamente',
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                tipoUsuario: usuario.tipoUsuario
            }
        })

    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al registrar usuario' })
    }
}

export const login = async (req, res) => {
    try{
        const {correo, contrasena} = req.body

        const usuario = await Usuario.findOne({correo}).select('+contrasena')

        if(!usuario){
            return res.status(404).send({success: false, message: 'Usuario no encontrado'})
        }

        const contrasenaValida = await checkPassword(
            contrasena,
            usuario.contrasena
        )

        if(!contrasenaValida){
            return res.status(401).send({succes: false, message: 'Constraseña incorrecta'})
        }

        const token = generateJwt({
            uid: usuario._id,
            correo: usuario.correo
        })

        return res.status(200).send({
            success: true, message: 'Inicio de sesión exitos',
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo
            }, token
        })

    } catch(err){
        console.error(err)

        return res.status(500).send({success: false, message: 'Error al iniciar sesion'})
    }
}