<aside class="contenedor-proyectos">
        <div class="panel crear-proyecto">
            <a href="#" class="boton">Nuevo Proyecto <i class="fas fa-plus"></i> </a>
        </div>
    
        <div class="panel lista-proyectos">
            <h2>Proyectos</h2>
            <ul id="proyectos">
                <?php 
                    $id_usuario = $_SESSION['id'];
                    $proyectos = obtenerProyectos($id_usuario);

                    if($proyectos) {
                        foreach ($proyectos as $proyecto) { ?>
                            <li>
                                <a href="index.php?id_proyecto=<?php echo $proyecto['id']; ?>" id="<?php echo $proyecto['id']; ?>">
                                    <?php echo $proyecto['nombre']; ?>
                                </a>
                                <i class="fas fa-times-circle"></i>
                            </li>
                    <?php   
                        }
                    } ?>
            </ul>
        </div>
</aside>