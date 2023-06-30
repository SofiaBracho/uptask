<?php

$accion = $_POST['accion'];

if($accion === 'crear') {

    $nombre = $_POST['proyecto'];

    include '../funciones/conexion.php';
    include '../funciones/sesiones.php';

    try {
        $id_usuario = $_SESSION['id'];

        // Consulta a la BD
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre, id_usuario) VALUES (?, ?) ");
        $stmt->bind_param('si', $nombre, $id_usuario);
        $stmt->execute();

        if($stmt->affected_rows == 1) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'nombre_proyecto' => $nombre
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

if($accion === 'eliminar') {

    include '../funciones/conexion.php';

    try {
        $id_proyecto = $_POST['id'];

        // Consulta a la BD
        $stmt = $conn->prepare("DELETE FROM tareas WHERE id_proyecto = ? ");
        $stmt->bind_param('i', $id_proyecto);
        $stmt->execute();
         
        $stmt = $conn->prepare("DELETE FROM proyectos WHERE id = ? ");
        $stmt->bind_param('i', $id_proyecto);
        $stmt->execute();

        if($stmt->affected_rows == 1) {
            $respuesta = array(
                'respuesta' => 'correcto',
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