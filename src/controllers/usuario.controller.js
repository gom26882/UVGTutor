import Usuario from '../models/Usuario.js'

export const getUserById = async (req, res) =>{
    try{
        const usuario = await Usuario.findById(req.user.id)

        if (!usuario){
            return res.status(404).send({success: false, message: 'Usuario no encontrado'})
        }

        return res.status(200).send({success:true, usuario:{
            id: usuario._id,
            nombre: usuario.nombre,
            correo: usuario.correo
        }})

    } catch (err){
        return res.status(500).send({succes: false, message: 'Errror al obtener el usuario'})
    }
}


export const updateUser = async (req, res) =>{
    try{
        const { nombre, correo} = req.body

        const usuario = await Usuario.findById(req.user.id)

        if (!usuario){
            return res.status(404).send({success: false, message:'Usuario no encontrad'})
        }

        usuario.actualizarPerfil(nombre, correo)
        await usuario.save()

        return res.status(200).send({success: true, message: 'Perfil de usuario actualizado correctamente',
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo
            }
        })
    }catch (err){
        return res.status(500).send({succes: false, message:'Errro al actualizar el perfil'})
    }
}
