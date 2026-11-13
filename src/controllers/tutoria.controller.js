import Tutoria from '../models/Tutoria.js'
import Estudiante from '../models/Estudiante.js'
import Tutor from '../models/Tutor.js'
import Curso from '../models/Curso.js'
import { MODALIDAD } from '../../constants/modalidad.js'
import { ESTADO_TUTORIA } from '../../constants/estadoTutoria.js'
import { bloquesDe, buscarCruce, horasSeguidasDisponibles } from '../../helpers/horarios.js'

const ESTADOS_CON_CONTACTO = [ESTADO_TUTORIA.ACEPTADA, ESTADO_TUTORIA.COMPLETADA]

const ocultarContactoSiNoAplica = (tutoria) => {
    const objeto = tutoria.toObject ? tutoria.toObject() : tutoria
    if (!ESTADOS_CON_CONTACTO.includes(objeto.estado)) {
        if (objeto.tutor && typeof objeto.tutor === 'object') delete objeto.tutor.telefono
        if (objeto.estudiante && typeof objeto.estudiante === 'object') delete objeto.estudiante.telefono
    }
    return objeto
}

const formatoHora = fecha => new Date(fecha).toLocaleTimeString('es-GT', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Guatemala'
})

export const solicitarTutoria = async (req, res) => {
    try {
        const { tutorId, cursoId, fecha, cantidadHoras, modalidad, detalles } = req.body

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
            return res.status(400).send({success: false, message: 'La fecha debe ser valida'})
        }

        if (!tutor.estaDisponible(fechaTutoria)) {
            return res.status(400).send({success: false, message: 'El tutor no esta disponible en ese horario'})
        }

        const horasSeguidas = horasSeguidasDisponibles(tutor.horariosDisponibles, fechaTutoria)

        if (horasSeguidas < Number(cantidadHoras)) {
            return res.status(400).send({
                success: false,
                message: `Desde las ${formatoHora(fechaTutoria)} el tutor solo tiene ${horasSeguidas} hora(s) seguida(s) disponible(s)`
            })
        }

        const confirmadas = await Tutoria.getConfirmadasDeTutor(tutor._id)

        if (buscarCruce(confirmadas, fechaTutoria, cantidadHoras)) {
            return res.status(400).send({success: false, message: 'Ese horario se cruza con otra tutoría que el tutor ya confirmó'})
        }

        const solicitudDuplicada = await Tutoria.findOne({
            estudiante: estudiante._id,
            tutor: tutor._id,
            fecha: fechaTutoria,
            estado: { $in: [ESTADO_TUTORIA.PENDIENTE, ESTADO_TUTORIA.ACEPTADA] }
        })

        if (solicitudDuplicada) {
            return res.status(400).send({success: false, message: 'Ya tienes una solicitud activa con este tutor en ese horario'})
        }

        const precioTotal = tutor.precioHora * Number(cantidadHoras)

        const tutoria = new Tutoria({
            estudiante: estudiante._id,
            tutor: tutor._id,
            curso: curso._id,
            fecha: fechaTutoria,
            cantidadHoras: Number(cantidadHoras),
            modalidad,
            precioTotal,
            detalles: detalles || ''
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

        await tutoria.populate([
            { path: 'estudiante', select: 'nombre correo carnet telefono' },
            { path: 'tutor', select: 'nombre correo modalidad precioHora telefono' },
            { path: 'curso' }
        ])

        return res.status(200).send({success: true, tutoria: ocultarContactoSiNoAplica(tutoria)})
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

        const tutorias = (await Tutoria.getTutoriasByEstudiante(estudiante._id)).map(ocultarContactoSiNoAplica)

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

        const tutorias = (await Tutoria.getTutoriasByTutor(tutor._id)).map(ocultarContactoSiNoAplica)

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

        if (new Date(tutoria.fecha) <= new Date()) {
            return res.status(400).send({success: false, message: 'No puedes aceptar una tutoría cuya fecha ya pasó'})
        }

        const tutor = await Tutor.findById(tutoria.tutor)

        if (!tutor) {
            return res.status(404).send({success: false, message: 'Tutor no encontrado'})
        }

        const confirmadas = await Tutoria.getConfirmadasDeTutor(tutor._id, tutoria._id)
        const cruce = buscarCruce(confirmadas, tutoria.fecha, tutoria.cantidadHoras)

        if (cruce) {
            return res.status(400).send({
                success: false,
                message: `Se cruza con otra tutoría que ya aceptaste a las ${formatoHora(cruce.fecha)}`
            })
        }

        const bloquesLibres = bloquesDe(tutoria.fecha, tutoria.cantidadHoras).every(bloque => tutor.estaDisponible(bloque))

        if (!bloquesLibres) {
            return res.status(400).send({
                success: false,
                message: `Ya no tienes las ${tutoria.cantidadHoras} hora(s) seguidas disponibles desde las ${formatoHora(tutoria.fecha)}`
            })
        }

        const aceptada = tutoria.aceptarTutoria()

        if (!aceptada) {
            return res.status(400).send({success: false, message: 'La tutoría no puede ser aceptada'})
        }

        await tutoria.save()

        bloquesDe(tutoria.fecha, tutoria.cantidadHoras).forEach(bloque => tutor.eliminarHorario(bloque))
        await tutor.save()

        const pendientes = await Tutoria.find({
            _id: { $ne: tutoria._id },
            tutor: tutor._id,
            estado: ESTADO_TUTORIA.PENDIENTE
        }).select('fecha cantidadHoras')

        const idsQueSeCruzan = pendientes
            .filter(pendiente => buscarCruce([tutoria], pendiente.fecha, pendiente.cantidadHoras))
            .map(pendiente => pendiente._id)

        await Tutoria.updateMany(
            { _id: { $in: idsQueSeCruzan } },
            {
                $set: {
                    estado: ESTADO_TUTORIA.RECHAZADA,
                    motivoRechazo: 'Horario ocupado',
                    mensajeRechazo: 'El tutor aceptó otra tutoría que se cruza con este horario. Intenta con otro horario disponible.'
                }
            }
        )

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

        const { motivo, mensaje } = req.body

        const rechazada = tutoria.rechazarTutoria(motivo, mensaje)

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

        if (new Date(tutoria.fecha) <= new Date()) {
            return res.status(400).send({success: false, message: 'No se puede cancelar una tutoría que ya inició'})
        }

        const estabaAceptada = tutoria.estado === ESTADO_TUTORIA.ACEPTADA
        const { motivo, mensaje } = req.body

        const cancelada = tutoria.cancelarTutoria(esTutor ? 'Tutor' : 'Estudiante', motivo, mensaje)

        if (!cancelada) {
            return res.status(400).send({success: false, message: 'La tutoría no puede ser cancelada'})
        }

        await tutoria.save()

        if (estabaAceptada) {
            const tutor = await Tutor.findById(tutoria.tutor)

            if (tutor) {
                bloquesDe(tutoria.fecha, tutoria.cantidadHoras)
                    .filter(bloque => bloque > new Date())
                    .forEach(bloque => tutor.agregarHorario(bloque))
                await tutor.save()
            }
        }

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