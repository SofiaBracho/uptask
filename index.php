<?php
    include 'inc/funciones/sesiones.php';
    include 'inc/funciones/funciones.php';
    include 'inc/templates/header.php';
    include 'inc/templates/barra.php';
?>

<div class="contenedor">
    <?php 
        include 'inc/templates/sidebar.php';
    ?>

    <main class="contenido-principal">
        <?php 
            if(isset($_GET['id_proyecto'])) {
                $id_proyecto = $_GET['id_proyecto'];
                $proyecto = obtenerNombreProyecto($id_proyecto);
        ?>
            <h1>Proyecto Actual: 
                    <?php 
                        foreach ($proyecto as $nombre) { ?>
                            <span> <?php echo $nombre['nombre']; ?> </span>
                    <?php } ?>
                </span>
            </h1>

            <form action="#" class="agregar-tarea">
                <div class="campo">
                    <label for="tarea">Tarea:</label>
                    <input type="text" placeholder="Nombre Tarea" class="nombre-tarea"> 
                </div>
                <div class="campo enviar">
                    <input type="hidden" id="id_proyecto" value="<?php echo $id_proyecto; ?>">
                    <input type="submit" class="boton nueva-tarea" value="Agregar">
                </div>
            </form>


        <h2>Listado de tareas:</h2>

        <div class="listado-pendientes">
            <ul>
                <?php
                    // Obtener la lista de tareas
                    $tareas = obtenerTareasProyecto($id_proyecto);

                    if($tareas->num_rows > 0) {
                        // Si hay tareas
                        foreach ($tareas as $tarea) { ?>
                            <li id="tarea:<?php echo $tarea['id'] ?>" class="tarea">
                                <p><?php echo $tarea['nombre'] ?></p>
                                <div class="acciones">
                                    <i class="far fa-check-circle <?php echo ($tarea['estado'] === '1' ? 'completo' : '' ) ?>"></i>
                                    <i class="fas fa-trash"></i>
                                </div>
                            </li>  
                        <?php } 
                    } else {
                        // No hay tareas ?>
                        <p class="lista-vacia">No hay tareas en este proyecto</p>
              <?php } ?>
                
                
            </ul>
        </div>

        <div class="avance">
            <h2>Avance del proyecto:</h2>
            <div class="barra-avance" id="barra-avance">
                <p></p>
                <div class="porcentaje" id="porcentaje">
                    <p></p>
                </div>
            </div>
        </div>

        <?php } else { ?>
            <p>Selecciona un proyecto a la izquierda</p>
        <?php } ?>
    </main>
</div><!--.contenedor-->


<?php
    include 'inc/templates/footer.php';
?>