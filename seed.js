// Carga datos iniciales para probar el sistema:
//   - catálogo de cursos
//   - un tutor y un estudiante de demostración
// Uso: npm run seed   (es idempotente, no duplica datos)

import { config } from 'dotenv'
import mongoose from 'mongoose'

import { connect } from './configs/mongo.js'
import Curso from './src/models/Curso.js'
import Usuario from './src/models/Usuario.js'
import Tutor from './src/models/Tutor.js'
import Estudiante from './src/models/Estudiante.js'
import { encrypt } from './utils/encrypt.js'

config()

const CURSOS = [
    { codigo: 'MM2015', nombre: 'Cálculo I' },
    { codigo: 'MM2021', nombre: 'Cálculo II' },
    { codigo: 'MM2010', nombre: 'Precálculo' },
    { codigo: 'FF1004', nombre: 'Física I' },
    { codigo: 'QQ1001', nombre: 'Química' },
    { codigo: 'CC2005', nombre: 'Programación' },
    { codigo: 'CC2008', nombre: 'POO' },
    { codigo: 'CC3054', nombre: 'Lógica Digital' },
    { codigo: 'MM2026', nombre: 'Estadística I' }
]

const crearHorariosDemo = () => {
    const horarios = []
    const base = new Date()
    base.setMinutes(0, 0, 0)

    for (let dia = 1; dia <= 7; dia++) {
        for (const hora of [9, 14, 16]) {
            const fecha = new Date(base)
            fecha.setDate(base.getDate() + dia)
            fecha.setHours(hora)
            horarios.push(fecha)
        }
    }

    return horarios
}

const seed = async () => {
    if (!process.env.URI_MONGO) {
        throw new Error('No se encontro URI_MONGO')
    }

    await connect()
    console.log(`Seed | db: "${mongoose.connection.name}"`)

    let creados = 0
    for (const curso of CURSOS) {
        const resultado = await Curso.updateOne({ codigo: curso.codigo }, { $setOnInsert: curso }, { upsert: true })
        if (resultado.upsertedCount) creados++
    }

    const cursos = await Curso.find()
    console.log(`Seed | cursos nuevos: ${creados} · total en catálogo: ${cursos.length}`)

    const porNombre = nombre => cursos.find(curso => curso.nombre === nombre)?._id

    if (await Usuario.findOne({ correo: 'tutor.demo@uvg.edu.gt' })) {
        console.log('Seed | tutor demo ya existía (no se duplica)')
    } else {
        await new Tutor({
            nombre: 'Tutor Demo',
            correo: 'tutor.demo@uvg.edu.gt',
            contrasena: await encrypt('Tutor123!'),
            telefono: '5555-1234',
            experiencia: 'Tutor de matemáticas y programación con 2 años de experiencia',
            precioHora: 75,
            modalidad: 'VIRTUAL',
            cursos: [porNombre('Cálculo I'), porNombre('POO'), porNombre('Programación')].filter(Boolean),
            horariosDisponibles: crearHorariosDemo()
        }).save()
        console.log('Seed | tutor creado: tutor.demo@uvg.edu.gt / Tutor123!')
    }

    if (await Usuario.findOne({ correo: 'estudiante.demo@uvg.edu.gt' })) {
        console.log('Seed | estudiante demo ya existía (no se duplica)')
    } else {
        let carnet = 26001
        while (await Estudiante.findOne({ carnet: String(carnet) })) carnet++

        await new Estudiante({
            nombre: 'Estudiante Demo',
            correo: 'estudiante.demo@uvg.edu.gt',
            contrasena: await encrypt('Estudiante123!'),
            telefono: '5555-5678',
            carnet: String(carnet),
            cursos: [porNombre('Cálculo I')].filter(Boolean)
        }).save()
        console.log('Seed | estudiante creado: estudiante.demo@uvg.edu.gt / Estudiante123!')
    }

    console.log('Seed | listo ✔')
    await mongoose.disconnect()
}

seed().catch(async err => {
    console.error('Seed | ERROR:', err.message)
    await mongoose.disconnect()
    process.exit(1)
})
