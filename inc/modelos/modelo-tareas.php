<?php

if($_POST['accion'] === 'crear') {
    $tarea = $_POST['tarea'];
    $accion = $_POST['accion'];
    $id_proyecto = (int) $_POST['id_proyecto'];

    include '../funciones/conexion.php';

    try {
        // Consulta a la BD
        $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?, ?) ");
        $stmt->bind_param('si', $tarea, $id_proyecto);
        $stmt->execute();

        if($stmt->affected_rows == 1) {
            $respuesta = array(
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'accion' => $accion,
                'tarea' => $tarea
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

if($_POST['accion'] === 'actualizar') {
    $idTarea = (int) $_POST['id'];
    $accion = $_POST['accion'];
    $estado = (int) $_POST['estado'];

    include '../funciones/conexion.php';

    try {
        // Consulta a la BD
        $stmt = $conn->prepare("UPDATE tareas SET estado = ? WHERE id = ? ");
        $stmt->bind_param('ii', $estado, $idTarea);
        $stmt->execute();

        if($stmt->affected_rows == 1) {
            $respuesta = array(
                'respuesta' => 'correcto'
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

if($_POST['accion'] === 'eliminar') {
    $idTarea = (int) $_POST['id'];
    $accion = $_POST['accion'];

    include '../funciones/conexion.php';

    try {
        // Consulta a la BD
        $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ? ");
        $stmt->bind_param('i', $idTarea);
        $stmt->execute();

        if($stmt->affected_rows == 1) {
            $respuesta = array(
                'respuesta' => 'correcto'
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