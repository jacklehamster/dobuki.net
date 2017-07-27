<?php
namespace Dobuki;

require_once 'php/globals.php';

Globals::get_router()->handle();


?>
<div style="position: absolute; top: 0; height: 600px; width: 300px; overflow: scroll; display:none ">
    <pre>
    <?php
    echo "Hello world";
    var_dump($_REQUEST);
    var_dump($_SERVER);
    if (!isset($_SESSION['count'])) {
        $_SESSION['count'] = 0;
    } else {
        $_SESSION['count']++;
    }
    //    var_dump($server);
    var_dump($_SESSION);
    ?>
    </pre>
</div>
