
import mongoose from 'mongoose'
import Tutor from '../models/Tutor.js'
import Curso from '../models/Curso.js'
import Tutoria from '../models/Tutoria.js'
import { buscarCruce, filtrarHorariosLibres } from '../../helpers/horarios.js'

const tutorPublico = (tutor, confirmadas = []) => {
    const objeto = tutor.toObject()
    delete objeto.telefono
    objeto.horariosDisponibles = filtrarHorariosLibres(objeto.horariosDisponibles || [], confirmadas)
    return objeto
}

const listaPublica = async (tutores) => {
    const confirmadasPorTutor = await Tutoria.getConfirmadasPorTutor()
    return tutores.map(tutor => tutorPublico(tutor, confirmadasPorTutor[tutor._id.toString()]))
}

export const getAllTutores = async (req, res) => {
    try {
        const tutores = await listaPublica(await Tutor.getAllTutores())
        return res.status(200).send({success: true, tutores})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al obtener los tutores'})
    }
}

export const getTutoresByModalidad = async (req, res) => {
    try {
        const { modalidad } = req.params
        const tutores = await listaPublica(await Tutor.getTutoresByModalidad(modalidad))
        return res.status(200).send({success: true, tutores})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al filtrar tutores por modalidad'})
    }
}

export const getTutorPublicoById = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send({success: false, message: 'ID del tutor no válido'})
        }

        const tutor = await Tutor.getTutorById(id)

        if (!tutor) {
            return res.status(404).send({success: false, message: 'Tutor no encontrado'})
        }

        const confirmadas = await Tutoria.getConfirmadasDeTutor(tutor._id)

        return res.status(200).send({success: true, tutor: tutorPublico(tutor, confirmadas)})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al obtener el perfil del tutor'})
    }
}

export const getTutorById = async (req, res) => {
    try {
        const tutor = await Tutor.getTutorById(req.user.id)

        if (!tutor) {
            return res.status(404).send({success: false, message: 'Tutor no encontrado'})
        }

        return res.status(200).send({success: true, tutor})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al obtener el tutor'})
    }
}

export const updateTutor = async (req, res) => {
    try {
        const { experiencia, precioHora, modalidad } = req.body
        const tutor = await Tutor.getTutorById(req.user.id)

        if (!tutor) {
            return res.status(404).send({success: false, message: 'Tutor no encontrado'})
        }

        tutor.updateTutor(experiencia, precioHora, modalidad)
        await tutor.save()
        await tutor.populate('cursos')

        return res.status(200).send({success: true, message: 'Tutor actualizado correctamente', tutor})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al actualizar el tutor'})
    }
}

export const agregarCurso = async (req, res) => {
    try {
        const { cursoId } = req.params
        const tutor = await Tutor.getTutorById(req.user.id)

        if (!tutor) {
            return res.status(404).send({success: false, message: 'Tutor no encontrado'})
        }

        const curso = await Curso.getCursoById(cursoId)

        if (!curso) {
            return res.status(404).send({success: false, message: 'Curso no encontrado'})
        }

        const agregado = tutor.agregarCurso(curso._id)

        if (!agregado) {
            return res.status(400).send({success: false, message: 'El tutor ya tiene este curso'})
        }

        await tutor.save()
        await tutor.populate('cursos')
        return res.status(200).send({success: true, message: 'Curso agregado correctamente', tutor})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al agregar el curso'})
    }
}

export const eliminarCurso = async (req, res) => {
    try {
        const { cursoId } = req.params
        const tutor = await Tutor.getTutorById(req.user.id)

        if (!tutor) {
            return res.status(404).send({success: false, message: 'Tutor no encontrado'})
        }

        const eliminado = tutor.eliminarCurso(cursoId)

        if (!eliminado) {
            return res.status(400).send({success: false, message: 'El tutor no tiene este curso'})
        }

        await tutor.save()
        await tutor.populate('cursos')
        return res.status(200).send({success: true, message: 'Curso eliminado correctamente', tutor})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al eliminar el curso'})
    }
}

export const agregarHorario = async (req, res) => {
    try {
        const { horario } = req.body
        const tutor = await Tutor.getTutorById(req.user.id)

        if (!tutor) {
            return res.status(404).send({success: false, message: 'Tutor no encontrado'})
        }

        const fecha = new Date(horario)

        if (Number.isNaN(fecha.getTime()) || fecha <= new Date()) {
            return res.status(400).send({success: false, message: 'El horario debe ser una fecha futura'})
        }

        const confirmadas = await Tutoria.getConfirmadasDeTutor(tutor._id)

        if (buscarCruce(confirmadas, fecha, 1)) {
            return res.status(400).send({success: false, message: 'Esa hora está ocupada por una tutoría que ya confirmaste'})
        }

        const agregado = tutor.agregarHorario(fecha)

        if (!agregado) {
            return res.status(400).send({success: false, message: 'Ese horario ya está registrado'})
        }

        await tutor.save()
        await tutor.populate('cursos')

        return res.status(200).send({success: true, message: 'Horario agregado correctamente', tutor})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al agregar el horario'})
    }
}

export const eliminarHorario = async (req, res) => {
    try {
        const { horario } = req.body
        const tutor = await Tutor.getTutorById(req.user.id)

        if (!tutor) {
            return res.status(404).send({success: false, message: 'Tutor no encontrado'})
        }

        tutor.eliminarHorario(horario)
        await tutor.save()
        await tutor.populate('cursos')

        return res.status(200).send({success: true, message: 'Horario eliminado correctamente', tutor})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al eliminar el horario'})
    }
}
