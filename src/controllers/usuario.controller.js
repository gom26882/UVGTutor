import Usuario from '../models/Usuario.js'
import Estudiante from '../models/Estudiante.js'
import Tutor from '../models/Tutor.js'

const construirPerfil = async (usuario) => {
    const perfil = {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono || '',
        fotoPerfil: usuario.fotoPerfil || '',
        tipoUsuario: usuario.tipoUsuario
    }

    if (usuario.tipoUsuario === 'Estudiante') {
        const estudiante = await Estudiante.getEstudianteById(usuario._id)
        perfil.carnet = estudiante?.carnet
        perfil.cursos = estudiante?.cursos || []
    }

    if (usuario.tipoUsuario === 'Tutor') {
        const tutor = await Tutor.getTutorById(usuario._id)
        perfil.experiencia = tutor?.experiencia
        perfil.precioHora = tutor?.precioHora
        perfil.modalidad = tutor?.modalidad
        perfil.cursos = tutor?.cursos || []
        perfil.horariosDisponibles = tutor?.horariosDisponibles || []
    }

    return perfil
}

export const getUserById = async (req, res) =>{
    try{
        const usuario = await Usuario.findById(req.user.id)

        if (!usuario){
            return res.status(404).send({success: false, message: 'Usuario no encontrado'})
        }

        return res.status(200).send({success: true, usuario: await construirPerfil(usuario)})

    } catch (err){
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al obtener el usuario'})
    }
}


export const updateUser = async (req, res) =>{
    try{
        const {
            nombre,
            correo,
            telefono,
            fotoPerfil
        } = req.body
        const correoNormalizado = String(correo).trim().toLowerCase()

        const usuario = await Usuario.findById(req.user.id)

        if (!usuario){
            return res.status(404).send({success: false, message:'Usuario no encontrado'})
        }

        const correoEnUso = await Usuario.findOne({ correo: correoNormalizado, _id: { $ne: usuario._id } })

        if (correoEnUso) {
            return res.status(400).send({success: false, message: `El correo ${correoNormalizado} ya está registrado`})
        }

        const telefonoNormalizado = telefono !== undefined
            ? String(telefono).replace(/\D/g, '')
            : undefined;

        usuario.actualizarPerfil(
            nombre,
            correoNormalizado,
            telefonoNormalizado,
            fotoPerfil
        );
        await usuario.save()

        return res.status(200).send({success: true, message: 'Perfil de usuario actualizado correctamente',
            usuario: await construirPerfil(usuario)
        })
    }catch (err){
        console.error(err)
        return res.status(500).send({success: false, message:'Error al actualizar el perfil'})
    }
}
