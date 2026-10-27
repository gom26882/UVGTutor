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


export const agregarCurso = async (req, res) => {
    try {
        const { estudianteId, cursoId } = req.params

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
        return res.status(200).send({success: true, message: 'Curso agregado correctamente', estudiante})

    } catch (err) {
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al agregar el curso'})
    }
}

export const eliminarCurso = async (req, res) => {
    try {
        const { estudianteId, cursoId } = req.params
        const estudiante = await Estudiante.getEstudianteById(estudianteId)

        if (!estudiante) {
            return res.status(404).send({success: false, message: 'Estudiante no encontrado' })
        }

        estudiante.eliminarCurso(cursoId)

        await estudiante.save()

        return res.status(200).send({success: true, message: 'Curso eliminado correctamente', estudiante })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ success: false, message: 'Error al eliminar el curso' })
    }
}