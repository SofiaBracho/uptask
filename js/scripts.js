eventListeners();

// Elementos
const listaProyectos = document.querySelector('ul#proyectos');

function eventListeners() {
    // Actualizar progreso
    document.addEventListener('DOMContentLoaded', actualizarProgreso);

    // Boton para crear un nuevo proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);
    if(document.querySelector('.nueva-tarea')) {
        // Boton para crear una nueva tarea
        document.querySelector('.nueva-tarea').addEventListener('click', nuevaTarea);
    }
    if(document.querySelector('.listado-pendientes')) {
        // Botones para cambiar el estado de la tarea o borrarla
        document.querySelector('.listado-pendientes').addEventListener('click', botonesTarea);
    }
    if(document.querySelector('.lista-proyectos ul li')) {
        document.querySelector('.lista-proyectos').addEventListener('click', eliminarProyecto);
    }
}

function nuevoProyecto(e) {
    e.preventDefault();
    
    // Crea un input para el nombre del proyecto
    if(!document.querySelector('#nuevo-proyecto')){
        let nuevoProyecto = document.createElement('li');
        nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
        listaProyectos.appendChild(nuevoProyecto);

        // Seleccionar el ID del nuevoProyecto
        let inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

        // Crear Event Listener que detecte el Enter y cree el proyecto
        inputNuevoProyecto.addEventListener('keypress', function(e) {
            let tecla = e.keyCode || e.which;

            if(tecla === 13) {
                guardarProyectoDB(inputNuevoProyecto.value);
                listaProyectos.removeChild(nuevoProyecto);
            }
        });
    }
}

function guardarProyectoDB(nombreProyecto) {
    // Crear objeto AJAX
    let xhr = new XMLHttpRequest();

    // Enviar datos por formData
    let datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('accion', 'crear');

    // Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelos-proyecto.php', true);

    // En la carga
    xhr.onload = function() {
        if(xhr.status === 200) {
            // Obtener datos de la respuesta
            let respuesta = JSON.parse(xhr.responseText),
                proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;

            // Comprobando la inserción
            if(resultado === 'correcto') {
                // Fue exitoso
                if(tipo === 'crear') {
                    // Se creo un nuevo proyecto
                    // Inyectar en el HTML
                    let nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="${id_proyecto}"">
                            ${proyecto}
                        </a>
                        <i class="fas fa-times-circle"></i>
                    `;
                    
                    listaProyectos.appendChild(nuevoProyecto);
                    // Mostrar alerta
                    swal({
                        type: 'success',
                        title: 'Proyecto Creado',
                        text: 'El proyecto: ' + proyecto + ' Se creó correctamente'
                    })
                    .then(resultado => {
                        // Redireccionar a la URL
                        if(resultado.value) {
                            window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                        }
                    })
                } 
            } else {
                // Hubo un error
                swal({
                    type: 'error',
                    title: 'Error',
                    text: 'Hubo un error al crear el proyecto'
                })
            }
            
        }
    };

    // Enviar datos
    xhr.send(datos);
}

function eliminarProyecto(e) {
    e.preventDefault();
    
    if(e.target.classList.contains('fa-times-circle')) {
        // Eliminar el proyecto
        swal({
            title: '¿Estás seguro?',
            text: 'No podrás revertirlo',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminalo'
        }).then((result) => {
            if(result.value) {
                let proyectoEliminar = e.target.parentElement;
                // Borrar de la BD
                eliminarProyectoBD(proyectoEliminar);

                // Borrar del HTML
                proyectoEliminar.remove();

                // Mostrar mensaje
                swal({
                    title: '¡Borrado!',
                    text: 'Tu proyecto ha sido borrado',
                    type: 'success'
                }).then((result) => {
                    if(result.value) {
                        // Redireccionar al inicio
                        window.location.href = 'index.php';
                    }
                })
            }
        })
    }else if(e.target.hasAttribute('href')) {
        window.location.href = e.target.href;
    }
}

function eliminarProyectoBD(proyectoEliminar) {
    // Crear una variable para el id del proyecto
    let idProyecto = proyectoEliminar.childNodes[1].id;

    // Hacer llamado a AJAX para eliminar el proyecto en la BD
    let xhr = new XMLHttpRequest();

    // Informacion
    let datos = new FormData();
    datos.append('id', idProyecto);
    datos.append('accion', 'eliminar');

    // Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelos-proyecto.php', true);

    // On load
    xhr.onload = function() {
        if(this.status === 200) {
            JSON.parse(xhr.responseText);
        }
    }
    // Enviar la peticion
    xhr.send(datos)
}

function nuevaTarea(e) {
    e.preventDefault();

    // Tomar el valor de el input
    let nombreTarea = document.querySelector('.nombre-tarea').value;

    // Validar que el campo no esté vacío
    if(nombreTarea === '') {
        // Error
        swal({
            type: 'error',
            title: 'Error',
            text: 'La tarea debe tener un nombre'
        })
    } else {
        // El nombre ha sido ingresado, enviar los datos a PHP
        
        // Crear formData
        let datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        // Crear llamado a AJAX
        let xhr = new XMLHttpRequest();

        // Abrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        // Ejecutarlo y respuesta
        xhr.onload = function() {
            if(this.status === 200) {
                // Correcto
                let respuesta = JSON.parse(xhr.responseText);
                
                let resultado = respuesta.respuesta,
                    tarea = respuesta.tarea,
                    accion = respuesta.accion,
                    id_insertado = respuesta.id_insertado;

                if(resultado === 'correcto') {
                    // Todo bien

                    if(accion === 'crear') {
                        // Borrar el parrafo que dice que no hay tareas
                        let parrafoListaVacia = document.querySelectorAll('.lista-vacia');

                        if(parrafoListaVacia.length > 0) {
                            document.querySelector('.lista-vacia').remove();
                        }

                        // Notificación de creación
                        swal({
                            type: 'success',
                            title: 'Correcto',
                            text: 'La tarea ' + tarea + ' se creó correctamente'
                        })
                        // Construir el template
                        let listaTareas = document.querySelector('.listado-pendientes ul');
                        let nuevaTarea = document.createElement('li');

                        nuevaTarea.id = 'tarea:' + id_insertado;
                        nuevaTarea.classList.add('tarea');

                        nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        `;

                        // Agregarlo al HTML
                        listaTareas.appendChild(nuevaTarea);
                    
                        // Limpiar el formulario
                        document.querySelector('.agregar-tarea').reset();

                        // Actualizar progreso
                        actualizarProgreso();
                    }
                } else {
                    // Hubo un error
                    swal({
                        type: 'error',
                        title: 'Error',
                        text: 'Hubo un error al crear la tarea'
                    })
                }
            }
        }

        // Enviar la consulta
        xhr.send(datos);
    }
}

function botonesTarea(e) {
    e.preventDefault();

    if(e.target.classList.contains('fa-check-circle')) {
        // Cambiar el estado de las tareas
        if(e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }
    
    if(e.target.classList.contains('fa-trash')) {
        // Eliminar la tarea
        swal({
            title: '¿Estás seguro?',
            text: 'No podrás revertirlo',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminalo'
        }).then((result) => {
            if(result.value) {
                let tareaEliminar = e.target.parentElement.parentElement;
                // Borrar de la BD
                eliminarTareaBD(tareaEliminar);

                // Borrar del HTML
                tareaEliminar.remove();

                // Mostrar mensaje
                swal({
                    title: '¡Borrado!',
                    text: 'Tu tarea ha sido borrada',
                    type: 'success'
                })

                // Actualizar progreso
                actualizarProgreso();
            }
        })
    }
}

function cambiarEstadoTarea(tarea, estado) {
    idTarea = tarea.parentElement.parentElement.id.split(':');

    // Hacer llamado a AJAX para cambiar el estado en la BD
    let xhr = new XMLHttpRequest();

    // Informacion
    let datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);

    // Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    // On load
    xhr.onload = function() {
        if(this.status === 200) {
            JSON.parse(xhr.responseText);

            // Actualizar progreso
            actualizarProgreso();
        }
    }
    // Enviar la peticion
    xhr.send(datos)
}

function eliminarTareaBD(tarea) {
    idTarea = tarea.id.split(':');

    // Hacer llamado a AJAX para eliminar la tarea en la BD
    let xhr = new XMLHttpRequest();

    // Informacion
    let datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');

    // Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    // On load
    xhr.onload = function() {
        if(this.status === 200) {
            JSON.parse(xhr.responseText);

            // Si está vacía la lista agregar el mensaje
            let listaTareas = document.querySelectorAll('li.tarea');

            if(listaTareas.length === 0) {
                document.querySelector('.listado-pendientes ul').innerHTML = '<p class="lista-vacia">No hay tareas en este proyecto</p>';
            }
        }
    }
    // Enviar la peticion
    xhr.send(datos)
}

function actualizarProgreso() {
    // Contar el numero de tareas
    let tareas = document.querySelectorAll('li.tarea').length;

    // Contar el numero de tareas completadas
    let tareasCompletadas = document.querySelectorAll('i.completo').length;

    // Si hay tareas mostrar el porcentaje de avance
    if(tareas > 0) {
        // Mostrar barra
        if(document.querySelector('.avance')) {
            document.querySelector('.avance').style.display = 'block';
        }
        // Calcular el porcentaje
        let porcentaje = Math.round( (tareasCompletadas / tareas) * 100 );

        // Agregar el porcentaje a la barra
        document.querySelector('#porcentaje').style.width = porcentaje + '%';
        if(porcentaje > 0) {
            document.querySelector('.porcentaje p').style.opacity = '100%';
            document.querySelector('.porcentaje p').innerHTML = porcentaje + '%';
            document.querySelector('.barra-avance p').style.opacity = '0%';

        } else {
            document.querySelector('.porcentaje p').style.opacity = '0%';
            document.querySelector('.barra-avance p').innerHTML = porcentaje + '%';
            document.querySelector('.barra-avance p').style.opacity = '100%';
        }

        // Mostrar una notificación al llegar al 100%
        if(porcentaje === 100) {
            swal({
                type: 'success',
                title: 'Felicidades',
                text: 'Has completado las tareas de este proyecto'
            })
        }
    } else {
        // Ocultar barra
        if(document.querySelector('.avance')) {
            document.querySelector('.avance').style.display = 'none';
        }
    }
}