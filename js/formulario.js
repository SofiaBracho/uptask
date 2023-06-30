
eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
    e.preventDefault();

    let usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;
    
    if(usuario === '' || password === '') {
        //La validacion fallo
        swal({
            type: 'error',
            title: '¡Error!',
            text: 'Los campos son obligatorios'
        })
    } else {
        //Enviar datos por AJAX
        let datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        const xhr = new XMLHttpRequest();

        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

        xhr.onload = function() {
            if(this.status == 200) {
                var respuesta = JSON.parse(xhr.responseText);

                if(respuesta.respuesta === 'correcto') {
                    // Si la petición tiene éxito
                    if(respuesta.tipo === 'crear') {
                        // Si se está registrando un usuario
                        swal({
                            type: 'success',
                            title: 'Usuario creado',
                            text: 'El usuario se creo correctamente'
                        })
                        .then(resultado => {
                            if(resultado.value) {
                                window.location.href = 'login.php';
                            }
                        })
                    } else if(respuesta.tipo === 'login'){
                        // Si se está logeando un usuario
                        swal({
                            type: 'success',
                            title: 'Login Correcto',
                            text: 'Presiona OK Para Abrir el Dashboard'
                        })
                        .then(resultado => {
                            if(resultado.value) {
                                window.location.href = 'index.php';
                            }
                        })
                    }
                } else {
                    // Si la petición falla
                    swal({
                        type: 'error',
                        title: 'Error',
                        text: respuesta.error
                    })

                    console.log(respuesta);
                }
            }
        }

        xhr.send(datos);
    }
}