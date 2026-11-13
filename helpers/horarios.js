'use strict'

// Utilidades para manejar los horarios como bloques de 1 hora.
// Una tutoría de N horas que empieza a las 13:00 ocupa los bloques 13:00, 14:00, ..., 13+N-1

export const HORA_MS = 60 * 60 * 1000

// Fechas de inicio de cada bloque de una hora que ocupa una tutoría
export const bloquesDe = (inicio, horas) => {
    const base = new Date(inicio).getTime()
    return Array.from({ length: Number(horas) || 1 }, (_, i) => new Date(base + i * HORA_MS))
}

// ¿Se cruzan los intervalos [aInicio, aInicio + aHoras) y [bInicio, bInicio + bHoras)?
export const seTraslapan = (aInicio, aHoras, bInicio, bHoras) => {
    const aIni = new Date(aInicio).getTime()
    const aFin = aIni + Number(aHoras) * HORA_MS
    const bIni = new Date(bInicio).getTime()
    const bFin = bIni + Number(bHoras) * HORA_MS
    return aIni < bFin && bIni < aFin
}

// Busca una tutoría (de la lista) que se cruce con el intervalo dado
export const buscarCruce = (tutorias, inicio, horas) => {
    return tutorias.find(tutoria => seTraslapan(tutoria.fecha, tutoria.cantidadHoras, inicio, horas))
}

// Quita de la lista los horarios que caen dentro de una tutoría ya confirmada
export const filtrarHorariosLibres = (horarios, ocupadas) => {
    if (!ocupadas.length) return horarios
    return horarios.filter(horario => !buscarCruce(ocupadas, horario, 1))
}

// Cuántas horas seguidas hay disponibles a partir de un horario
export const horasSeguidasDisponibles = (horarios, inicio) => {
    const disponibles = new Set(horarios.map(horario => new Date(horario).getTime()))
    let horas = 0
    let actual = new Date(inicio).getTime()

    while (disponibles.has(actual)) {
        horas++
        actual += HORA_MS
    }

    return horas
}
