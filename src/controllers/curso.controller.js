import Curso from '../models/Curso.js'

export const createCurso = async (req, res) => {
    try {
        const codigo = String(req.body.codigo)
            .trim()
            .toUpperCase();

        const nombre = String(req.body.nombre)
            .trim()
            .replace(/\s+/g, ' ');

        const nombreSeguro = nombre.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&'
        );

        const cursoExistente = await Curso.findOne({
            $or: [
                { codigo },
                {
                    nombre: {
                        $regex: `^${nombreSeguro}$`,
                        $options: 'i'
                    }
                }
            ]
        });

        if (cursoExistente) {
            return res.status(409).send({
                success: false,
                message: `El curso ${cursoExistente.nombre} (${cursoExistente.codigo}) ya existe. Selecciónalo desde el catálogo.`
            });
        }

        const curso = new Curso({
            codigo,
            nombre
        });

        await curso.save();

        return res.status(201).send({
            success: true,
            message: 'Curso agregado correctamente',
            curso
        });
    } catch (err) {
        console.error(err);

        if (err.code === 11000) {
            return res.status(409).send({
                success: false,
                message: 'Ya existe un curso con ese código.'
            });
        }

        return res.status(500).send({
            success: false,
            message: 'Error al crear el curso'
        });
    }
};

export const getAllCursos = async (req, res) =>{
    try{
        const cursos = await Curso.getAllCursos()
        return res.status(200).send({success: true, cursos})

    }catch (err){
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al obtener los cursos'})
    }
}


export const getCursoById = async (req, res) => {
    try{
        const { id } = req.params
        
        const curso = await Curso.getCursoById(id)

        if(!curso){
            return res.status(404).send({success: false, message: 'Curso no encontrado'})
        }
        
        return res.status(200).send({success: true, curso})

    }catch(err){
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al obtener el curso'})
    }
}

export const updateCurso = async (req, res) => {
    try{
        const { id } = req.params
        const { codigo, nombre } = req.body
        
        const curso = await Curso.getCursoById(id)
        if(!curso){
            return res.status(404).send({success: false, message: 'Curso no encontrado'})
        }

        curso.updateCurso(codigo, nombre)
        await curso.save()

        return res.status(200).send({success: true, message: 'Curso actualizado correctamente', curso})
        
    }catch(err){
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al actualizar el curso'})
    }
}


export const deleteCurso = async (req, res) => {
    try{
        const { id } = req.params
        
        const curso = await Curso.deleteCursoById(id)
        if(!curso){
            return res.status(404).send({success: false, message: 'Curso no encontrado'})
        }

        return res.status(200).send({success: true, message: 'Curso eliminado correctamente'})

    }catch(err){
        console.error(err)
        return res.status(500).send({success: false, message: 'Error al eliminar el curso'})
    }
}

