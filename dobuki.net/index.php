<?php
require_once 'php/page.php';

(new Page([
    'title' => 'DOBUKI is BACK',
    'stylesheet' => 'style.css',
    'render_body' => function () {?>
        <div style="display: flex; flex-direction: row;">
             <img src="dobuki.png" style="width: 75px; height: 75px"> <h1>DOBUKI.net</h1>
        </div>
        <hr>
        Welcome, friend. The best is yet to come.
    <?},
]))->render();
?>

<div style="height: 600px; overflow: scroll">
    <pre>
    <?php
    echo "Hello world";
    var_dump($_REQUEST);
    var_dump($_SERVER);
    ?>
    </pre>
</div>
