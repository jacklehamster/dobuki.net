<?php
require_once 'common/php/page.php';

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

