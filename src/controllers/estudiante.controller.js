import mongoose from 'mongoose'
import Estudiante from '../models/Estudiante.js'
import Curso from '../models/Curso.js'

export const getAllEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.getAllEstudiantes()

        return res.status(200).send({success: true, estudiantes })

    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al obtener los estudiantes' })
    }
}

export const getEstudianteById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send({success: false, message: 'ID de estudiante no válido' })
        }

        const estudiante = await Estudiante.getEstudianteById(id)

        if (!estudiante) {
            return res.status(404).send({success: false, message: 'Estudiante no encontrado' })
        }

        return res.status(200).send({ success: true, estudiante})

    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al obtener el estudiante' })
    }
}


export const getMiPerfil = async (req, res) => {
    try {
        const estudiante = await Estudiante.getEstudianteById(req.user.id)

        if (!estudiante) {
            return res.status(404).send({success: false, message: 'Estudiante no encontrado' })
        }

        return res.status(200).send({ success: true, estudiante })

    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al obtener el perfil del estudiante' })
    }
}

const esElMismoEstudiante = (req, estudianteId) => req.user.id.toString() === estudianteId.toString()

export const agregarCurso = async (req, res) => {
    try {
        const { estudianteId, cursoId } = req.params

        if (!esElMismoEstudiante(req, estudianteId)) {
            return res.status(403).send({success: false, message: 'Solo puedes modificar tus propios cursos'})
        }

        const estudiante = await Estudiante.getEstudianteById(estudianteId)

        if (!estudiante) {
            return res.status(404).send({success: false, message: 'Estudiante no encontrado'})
        }

        const curso = await Curso.getCursoById(cursoId)

        if (!curso) {
            return res.status(404).send({ success: false, message: 'Curso no encontrado' })
        }

        const agregado = estudiante.agregarCurso(curso._id)

        if (!agregado) {
            return res.status(400).send({success: false, message: 'El estudiante ya tiene este curso' })
        }

        await estudiante.save()
        await estudiante.populate('cursos')
        return res.status(200).send({success: true, message: 'Curso agregado correctamente', estudiante})

    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al agregar el curso'})
    }
}

export const eliminarCurso = async (req, res) => {
    try {
        const { estudianteId, cursoId } = req.params

        if (!esElMismoEstudiante(req, estudianteId)) {
            return res.status(403).send({success: false, message: 'Solo puedes modificar tus propios cursos'})
        }

        const estudiante = await Estudiante.getEstudianteById(estudianteId)

        if (!estudiante) {
            return res.status(404).send({success: false, message: 'Estudiante no encontrado' })
        }

        const eliminado = estudiante.eliminarCurso(cursoId)

        if (!eliminado) {
            return res.status(400).send({success: false, message: 'El estudiante no tiene este curso' })
        }

        await estudiante.save()
        await estudiante.populate('cursos')

        return res.status(200).send({success: true, message: 'Curso eliminado correctamente', estudiante })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: 'Error al eliminar el curso' })
    }
}