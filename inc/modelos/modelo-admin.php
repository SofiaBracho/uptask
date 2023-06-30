<?php

$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if($accion === 'crear') {
    // Registrar a los administradores en la BD

    // Hashear passwords
    $opciones = array(
        'cost' => 12
    );
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);
    // Importar la conexion
    include '../funciones/conexion.php';

    try {
        // Consulta a la BD
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?) ");
        $stmt->bind_param('ss', $usuario, $hash_password);
        $stmt->execute();

        if($stmt->affected_rows == 1) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
            );
        } else {
            $respuesta = array(
                'respuesta' => 'error'
            );
        }

        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        // Tomar la excepcion
        $respuesta = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}

if($accion === 'login') {
    // Loguear a los administradores

    include '../funciones/conexion.php';

    try {
        // Sleccionar el administrador de la base de datos
        $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ? ");
        $stmt->bind_param('s', $usuario);
        $stmt->execute();

        // Loguear al usuario
        $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario);
        $stmt->fetch();

        // Si existe el usuario
        if($nombre_usuario) {
            if(password_verify($password, $pass_usuario)) {
                // Inicio la sesión
                session_start();
                $_SESSION['nombre'] = $usuario;
                $_SESSION['id'] = $id_usuario;
                $_SESSION['login'] = true;
                // La contraseña es correcta
                $respuesta = array(
                    'respuesta' => 'correcto',
                    'usuario' => $nombre_usuario,
                    'tipo' => $accion
                );
            } else{
                // Contraseña incorrecta
                $respuesta = array(
                    'error' => 'Contraseña incorrecta'
                );
            }
            
        } else{
            $respuesta = array(
                'error' => 'El usuario no existe'
            );
        }

        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        // Tomar la excepcion
        $respuesta = array(
            'pass' => $e->getMessage()
        );
    }

    echo json_encode($respuesta);
}