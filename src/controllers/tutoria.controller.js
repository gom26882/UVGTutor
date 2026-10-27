import Tutoria from '../models/Tutoria.js'
import Estudiante from '../models/Estudiante.js'
import Tutor from '../models/Tutor.js'
import Curso from '../models/Curso.js'
import { MODALIDAD } from '../../constants/modalidad.js'
import { ESTADO_TUTORIA } from '../../constants/estadoTutoria.js'

export const solicitarTutoria = async (req, res) => {
    try {
        const { tutorId, cursoId, fecha, cantidadHoras, modalidad } = req.body

        const estudiante = await Estudiante.getEstudianteById(req.user.id)

        if (!estudiante) {
            return res.status(404).send({success: false, message: 'Estudiante no encontrado'})
        }

        const tutor = await Tutor.getTutorById(tutorId)

        if (!tutor) {
            return res.status(404).send({success: false, message: 'Tutor no encontrado'})
        }

        const curso = await Curso.getCursoById(cursoId)

        if (!curso) {
            return res.status(404).send({success: false, message: 'Curso no encontrado'})
        }

        const imparteCurso = tutor.cursos.some(cursoTutor => cursoTutor._id.equals(curso._id))
        
        if (!imparteCurso) {
            return res.status(400).send({success: false, message: 'El tutor no imparte este curso'})
        }

        if (modalidad !== tutor.modalidad) {
            return res.status(400).send({success: false, message: 'El tutor no ofrece esta modalidad'})
        }

        if (!Number.isFinite(Number(cantidadHoras)) || Number(cantidadHoras) < 1) {
            return res.status(400).send({success: false, message: 'Cantidad de horas no válida'})
        }

        if (!Object.values(MODALIDAD).includes(modalidad)) {
            return res.status(400).send({success: false, message: 'Modalidad no válida'})
        }

        const fechaTutoria = new Date(fecha)

        if (Number.isNaN(fechaTutoria.getTime()) || fechaTutoria <= new Date()) {
            return res.status(400).send({success: false, message: 'La fecha debe ser válida y futura'})
        }

        if (!tutor.estaDisponible(fechaTutoria)) {
            return res.status(400).send({success: false, message: 'El tutor no está disponible en ese horario'})
        }

        const precioTotal = tutor.precioHora * Number(cantidadHoras)

        const tutoria = new Tutoria({
            estudiante: estudiante._id,
            tutor: tutor._id,
            curso: curso._id,
            fecha: fechaTutoria,
            cantidadHoras: Number(cantidadHoras),
            modalidad,
            precioTotal
        })

        await tutoria.save()

        return res.status(201).send({success: true, message: 'Tutoría solicitada correctamente', tutoria})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al solicitar la tutoría'})
    }
}

export const getTutoriaById = async (req, res) => {
    try {
        const { id } = req.params

        const tutoria = await Tutoria.getTutoriaById(id)

        if (!tutoria) {
            return res.status(404).send({success: false, message: 'Tutoría no encontrada'})
        }

        const usuarioId = req.user.id.toString()

        if (tutoria.estudiante.toString() !== usuarioId && tutoria.tutor.toString() !== usuarioId) {
            return res.status(403).send({success: false, message: 'No tienes acceso a esta tutoría'})
        }

        return res.status(200).send({success: true, tutoria})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al obtener la tutoría'})
    }
}

export const getTutoriasByEstudiante = async (req, res) => {
    try {
        const estudiante = await Estudiante.getEstudianteById(req.user.id)

        if (!estudiante) {
            return res.status(404).send({success: false, message: 'Estudiante no encontrado'})
        }

        const tutorias = await Tutoria.getTutoriasByEstudiante(estudiante._id)

        return res.status(200).send({success: true, tutorias})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al obtener las tutorías del estudiante'})
    }
}

export const getTutoriasByTutor = async (req, res) => {
    try {
        const tutor = await Tutor.getTutorById(req.user.id)

        if (!tutor) {
            return res.status(404).send({success: false, message: 'Tutor no encontrado'})
        }

        const tutorias = await Tutoria.getTutoriasByTutor(tutor._id)

        return res.status(200).send({success: true, tutorias})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al obtener las tutorías del tutor'})
    }
}

export const aceptarTutoria = async (req, res) => {
    try {
        const { id } = req.params

        const tutoria = await Tutoria.getTutoriaById(id)

        if (!tutoria) {
            return res.status(404).send({success: false, message: 'Tutoría no encontrada'})
        }

        if (tutoria.tutor.toString() !== req.user.id.toString()) {
            return res.status(403).send({success: false, message: 'No puedes aceptar esta tutoría'})
        }

        const aceptada = tutoria.aceptarTutoria()

        if (!aceptada) {
            return res.status(400).send({success: false, message: 'La tutoría no puede ser aceptada'})
        }

        await tutoria.save()

        return res.status(200).send({success: true, message: 'Tutoría aceptada correctamente', tutoria})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al aceptar la tutoría'})
    }
}

export const rechazarTutoria = async (req, res) => {
    try {
        const { id } = req.params

        const tutoria = await Tutoria.getTutoriaById(id)

        if (!tutoria) {
            return res.status(404).send({success: false, message: 'Tutoría no encontrada'})
        }

        if (tutoria.tutor.toString() !== req.user.id.toString()) {
            return res.status(403).send({success: false, message: 'No puedes rechazar esta tutoría'})
        }

        const rechazada = tutoria.rechazarTutoria()

        if (!rechazada) {
            return res.status(400).send({success: false, message: 'La tutoría no puede ser rechazada'})
        }

        await tutoria.save()

        return res.status(200).send({success: true, message: 'Tutoría rechazada correctamente', tutoria})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al rechazar la tutoría'})
    }
}

export const cancelarTutoria = async (req, res) => {
    try {
        const { id } = req.params

        const tutoria = await Tutoria.getTutoriaById(id)

        if (!tutoria) {
            return res.status(404).send({success: false, message: 'Tutoría no encontrada'})
        }

        const esEstudiante = tutoria.estudiante.toString() === req.user.id.toString()
        const esTutor = tutoria.tutor.toString() === req.user.id.toString()

        if (!esEstudiante && !esTutor) {
            return res.status(403).send({success: false, message: 'No puedes cancelar esta tutoría'})
        }

        const cancelada = tutoria.cancelarTutoria()

        if (!cancelada) {
            return res.status(400).send({success: false, message: 'La tutoría no puede ser cancelada'})
        }

        await tutoria.save()

        return res.status(200).send({success: true, message: 'Tutoría cancelada correctamente', tutoria})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al cancelar la tutoría'})
    }
}

export const completarTutoria = async (req, res) => {
    try {
        const { id } = req.params

        const tutoria = await Tutoria.getTutoriaById(id)

        if (!tutoria) {
            return res.status(404).send({success: false, message: 'Tutoría no encontrada'})
        }

        if (tutoria.tutor.toString() !== req.user.id.toString()) {
            return res.status(403).send({success: false, message: 'No puedes completar esta tutoría'})
        }

        if (tutoria.estado !== ESTADO_TUTORIA.ACEPTADA) {
            return res.status(400).send({success: false, message: 'La tutoría debe estar aceptada para completarse'})
        }

        if (new Date(tutoria.fecha).getTime() + tutoria.cantidadHoras * 60 * 60 * 1000 > Date.now()) {
            return res.status(400).send({success: false, message: 'La tutoría todavía no ha terminado'})
        }

        const completada = tutoria.completarTutoria()

        if (!completada) {
            return res.status(400).send({success: false, message: 'La tutoría no puede ser completada'})
        }

        await tutoria.save()

        return res.status(200).send({success: true, message: 'Tutoría completada correctamente', tutoria})
    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al completar la tutoría'})
    }
}