import Tutor from '../models/Tutor.js'
import Curso from '../models/Curso.js'

export const getAllTutores = async (req, res) => {
    try {
        const tutores = await Tutor.getAllTutores()

        return res.status(200).send({success: true, tutores })

    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al obtener los tutores' })
    }
}

export const getTutorById = async (req, res) => {
    try {
        const tutor = await Tutor.getTutorById(req.user.id)

        if (!tutor) {
            return res.status(404).send({success: false, message: 'Tutor no encontrado' })
        }

        return res.status(200).send({ success: true, tutor })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: 'Error al obtener el tutor'})
    }
}

export const updateTutor = async (req, res) => {
    try {
        const { experiencia, precioHora, modalidad } = req.body

        const tutor = await Tutor.getTutorById(req.user.id)

        if (!tutor) {
            return res.status(404).send({success: false, message: 'Tutor no encontrado' })
        }

        tutor.updateTutor(
            experiencia,
            precioHora,
            modalidad
        )

        await tutor.save()

        return res.status(200).send({ success: true, message: 'Tutor actualizado correctamente', tutor})

    } catch (err) {
        console.error(err)

        return res.status(500).send({
            success: false,
            message: 'Error al actualizar el tutor'
        })
    }
}

export const agregarCurso = async (req, res) => {
    try {
        const { cursoId } = req.params

        const tutor = await Tutor.getTutorById(req.user.id)

        if (!tutor) {
            return res.status(404).send({
                success: false,
                message: 'Tutor no encontrado'
            })
        }

        const curso = await Curso.getCursoById(cursoId)

        if (!curso) {
            return res.status(404).send({success: false, message: 'Curso no encontrado' })
        }

        tutor.agregarCurso(curso._id)

        await tutor.save()
        return res.status(200).send({success: true, message: 'Curso agregado correctamente', tutor })

    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al agregar el curso' })
    }
}

export const eliminarCurso = async (req, res) => {
    try {
        const { cursoId } = req.params

        const tutor = await Tutor.getTutorById(req.user.id)

        if (!tutor) {
            return res.status(404).send({ success: false, message: 'Tutor no encontrado' })
        }

        tutor.eliminarCurso(cursoId)
        await tutor.save()
        return res.status(200).send({success: true, message: 'Curso eliminado correctamente', tutor })

    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al eliminar el curso' })
    }
}

export const agregarHorario = async (req, res) => {
    try {
        const { horario } = req.body

        const tutor = await Tutor.getTutorById(req.user.id)

        if (!tutor) {
            return res.status(404).send({ success: false, message: 'Tutor no encontrado' })
        }

        tutor.agregarHorario(horario)

        await tutor.save()
        return res.status(200).send({success: true, message: 'Horario agregado correctamente', tutor})

    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al agregar el horario' })
    }
}

export const eliminarHorario = async (req, res) => {
    try {
        const { horario } = req.body

        const tutor = await Tutor.getTutorById(req.user.id)

        if (!tutor) {
            return res.status(404).send({success: false, message: 'Tutor no encontrado' })
        }

        tutor.eliminarHorario(horario)

        await tutor.save()
        return res.status(200).send({success: true, message: 'Horario eliminado correctamente', tutor })

    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al eliminar el horario' })
    }
}