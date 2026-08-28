# TutorUVG

Plataforma web orientada a objetos para conectar estudiantes de la Universidad del Valle de Guatemala con estudiantes que ofrecen servicios de tutoría

## Integrantes

- `Sergio Gómez - 26882`
- `Josué Morales - 26588`
- `Daniel Monroy - 26442`

---

# Índice

- [Análisis](#análisis)
  - [1. ¿Qué clases tendrá el sistema?](#1-qué-clases-tendrá-el-sistema)
  - [2. ¿Qué propiedades y métodos tendrá cada clase?](#2-qué-propiedades-y-métodos-tendrá-cada-clase)
  - [3. ¿Qué tipo tendrán las propiedades de cada clase?](#3-qué-tipo-tendrán-las-propiedades-de-cada-clase)
  - [4. ¿Cuáles serán los modificadores de visibilidad?](#4-cuáles-serán-los-modificadores-de-visibilidad)
  - [5. ¿Qué parámetros serán requeridos por los métodos?](#5-qué-parámetros-serán-requeridos-por-los-métodos)
  - [6. ¿Cómo se proveerán los valores iniciales a los objetos?](#6-cómo-se-proveerán-los-valores-iniciales-a-los-objetos)
  - [7. ¿Qué relaciones existen entre las clases?](#7-qué-relaciones-existen-entre-las-clases)
  - [8. ¿Qué enumeradores utilizará el sistema?](#8-qué-enumeradores-utilizará-el-sistema)

---

# Análisis

## 1. ¿Qué clases tendrá el sistema?

El sistema contará con las siguientes clases principales:

- `Usuario`
- `Estudiante`
- `Tutor`
- `Curso`
- `Tutoria`

Además, se utilizarán los enumeradores:

- `Modalidad`
- `EstadoTutoria`

La clase `Usuario` funcionará como clase padre de `Estudiante` y `Tutor`, permitiendo reutilizar los atributos y métodos que ambos tipos de usuario tienen en común

[Volver al índice](#índice)

---

## 2. ¿Qué propiedades y métodos tendrá cada clase?

### Usuario

La clase `Usuario` tendrá las propiedades:

- `id`
- `nombre`
- `correo`
- `contrasena`

Sus métodos serán:

- `iniciarSesion()`
- `actualizarPerfil()`
- `getId()`
- `getNombre()`
- `getCorreo()`

### Estudiante

La clase `Estudiante` heredará de `Usuario` y tendrá las propiedades:

- `carnet`
- `cursos[]`
- `tutorias[]`

Sus métodos serán:

- `agregarCurso()`
- `eliminarCurso()`
- `getCursos()`
- `buscarTutor()`
- `filtrarTutores()`
- `solicitarTutoria()`
- `consultarTutorias()`
- `consultarHistorial()`
- `getCarnet()`

### Tutor

La clase `Tutor` heredará de `Usuario` y tendrá las propiedades:

- `experiencia`
- `precioHora`
- `modalidad`
- `calificacion`
- `cursos[]`
- `horariosDisponibles[]`
- `tutorias[]`

Sus métodos serán:

- `establecerPrecio()`
- `establecerModalidad()`
- `agregarCurso()`
- `eliminarCurso()`
- `agregarHorario()`
- `eliminarHorario()`
- `estaDisponible()`
- `consultarSolicitudes()`
- `aceptarTutoria()`
- `rechazarTutoria()`
- `getExperiencia()`
- `getPrecioHora()`
- `getModalidad()`
- `getCalificacion()`
- `getCursos()`

### Curso

La clase `Curso` tendrá las propiedades:

- `id`
- `codigo`
- `nombre`

Sus métodos serán:

- `actualizarNombre()`
- `getId()`
- `getCodigo()`
- `getNombre()`

### Tutoria

La clase `Tutoria` tendrá las propiedades:

- `id`
- `estudiante`
- `tutor`
- `curso`
- `fecha`
- `cantidadHoras`
- `modalidad`
- `estado`
- `precioTotal`

Sus métodos serán:

- `aceptar()`
- `rechazar()`
- `cancelar()`
- `completar()`
- `calcularPrecio()`
- `getEstado()`
- `getFecha()`
- `getPrecioTotal()`

[Volver al índice](#índice)

---

## 3. ¿Qué tipo tendrán las propiedades de cada clase?

### Usuario

- `id`: `String`
- `nombre`: `String`
- `correo`: `String`
- `contrasena`: `String`

### Estudiante

- `carnet`: `String`
- `cursos`: `Array<Curso>`
- `tutorias`: `Array<Tutoria>`

### Tutor

- `experiencia`: `String`
- `precioHora`: `Number`
- `modalidad`: `Modalidad`
- `calificacion`: `Number`
- `cursos`: `Array<Curso>`
- `horariosDisponibles`: `Array<Date>`
- `tutorias`: `Array<Tutoria>`

### Curso

- `id`: `String`
- `codigo`: `String`
- `nombre`: `String`

### Tutoria

- `id`: `String`
- `estudiante`: `Estudiante`
- `tutor`: `Tutor`
- `curso`: `Curso`
- `fecha`: `Date`
- `cantidadHoras`: `Number`
- `modalidad`: `Modalidad`
- `estado`: `EstadoTutoria`
- `precioTotal`: `Number`

[Volver al índice](#índice)

---

## 4. ¿Cuáles serán los modificadores de visibilidad?

Los atributos propios de las clases serán principalmente `private` para mantener el encapsulamiento de los datos

Los atributos de `Usuario` que serán heredados por `Estudiante` y `Tutor` serán `private`

Los métodos que necesiten ser utilizados desde otras partes del sistema serán `public`

```

[Volver al índice](#índice)

---

## 5. ¿Qué parámetros serán requeridos por los métodos?

Algunos de los principales métodos utilizarán los siguientes parámetros:

### Estudiante

- `agregarCurso(Curso curso)`
  - `curso`

- `eliminarCurso(Curso curso)`
  - `curso`

- `buscarTutor(Curso curso)`
  - `curso`

- `filtrarTutores(Curso curso, Date horario, Modalidad modalidad, Number precioMax)`
  - `curso`
  - `horario`
  - `modalidad`
  - `precioMax`

- `solicitarTutoria(Tutor tutor, Curso curso, Date fecha, Modalidad modalidad)`
  - `tutor`
  - `curso`
  - `fecha`
  - `modalidad`

### Tutor

- `establecerPrecio(Number precio)`
  - `precio`

- `establecerModalidad(Modalidad modalidad)`
  - `modalidad`

- `agregarCurso(Curso curso)`
  - `curso`

- `eliminarCurso(Curso curso)`
  - `curso`

- `agregarHorario(Date horario)`
  - `horario`

- `eliminarHorario(Date horario)`
  - `horario`

- `estaDisponible(Date horario)`
  - `horario`

- `aceptarTutoria(Tutoria tutoria)`
  - `tutoria`

- `rechazarTutoria(Tutoria tutoria)`
  - `tutoria`

### Curso

- `actualizarNombre(String nombre)`
  - `nombre`

### Tutoria

Los métodos `aceptar()`, `rechazar()`, `cancelar()`, `completar()` y `calcularPrecio()` no usan parámetros, ya que utilizan la información almacenada dentro del objeto `Tutoria`

[Volver al índice](#índice)

---

## 6. ¿Cómo se proveerán los valores iniciales a los objetos?

Los valores iniciales de los objetos serán dados por medio de sus constructores

Por ejemplo, al crear un `Estudiante` se proporcionarán datos como:

- nombre
- correo
- contraseña
- carnet

Al crear un `Tutor` se proporcionará su información personal y posteriormente podrá registrar información relacionada con sus servicios, como cursos, experiencia, modalidad, precio y horarios disponibles.

Al crear una `Tutoria`, se proporcionarán el estudiante, tutor, curso, fecha, cantidad de horas y modalidad. El estado de una nueva tutoría comenzará como:

```text
PENDIENTE
```

El precio total podrá obtenerse utilizando el precio por hora del tutor y la cantidad de horas solicitadas

[Volver al índice](#índice)

---

## 7. ¿Qué relaciones existen entre las clases?

### Herencia

`Estudiante` y `Tutor` heredan de `Usuario`.

Esto permite que ambas clases reutilicen atributos como nombre, correo y contraseña

### Agregación

`Estudiante` mantiene una colección de objetos `Curso`. Los cursos pueden existir independientemente del estudiante
`Tutor` también mantiene una colección de cursos que puede impartir. Los cursos pueden existir independientemente del tutor


### Asociación

Un `Estudiante` puede participar en múltiples tutorías y cada `Tutoria` corresponde a un estudiante
Un `Tutor` puede impartir múltiples tutorías y cada `Tutoria` tiene un tutor
Cada `Tutoria` corresponde a un curso y un curso puede estar relacionado con múltiples tutorías

[Volver al índice](#índice)

---

## 8. ¿Qué enumeradores utilizará el sistema?

Se utilizarán dos enumeradores para limitar determinados valores dentro del sistema

### Modalidad

El enumerador `Modalidad` determinará la forma en la que puede realizarse una tutoría

```text
PRESENCIAL
VIRTUAL
```

Será utilizado por las clases `Tutor` y `Tutoria`.

### EstadoTutoria

El enumerador `EstadoTutoria` permitirá conocer el estado actual de una tutoría

```text
PENDIENTE
ACEPTADA
RECHAZADA
CANCELADA
COMPLETADA
```

Una nueva tutoría comenzará con el estado `PENDIENTE` y podrá cambiar dependiendo de las acciones realizadas por el tutor o estudiante

[Volver al índice](#índice)

---

# Tecnologías

El proyecto será desarrollado utilizando:

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose

La aplicación seguirá los principios de Programación Orientada a Objetos y utilizará una arquitectura MVC para separar el modelo, la vista y los controladores