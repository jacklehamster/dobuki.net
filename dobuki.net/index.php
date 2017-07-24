<?php
require_once 'php/server.php';
require_once 'php/page.php';

(new Page([
    'title' => 'DOBUKI is BACK',
    'page' => 'homepage',
]))->render();
?>

<div style="height: 600px; overflow: scroll; display: none">
    <pre>
    <?php
    echo "Hello world";
    var_dump($_REQUEST);
    var_dump($_SERVER);
    ?>
    </pre>
</div>
