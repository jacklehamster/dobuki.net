<?php
namespace Dobuki;

require_once 'php/globals.php';

Globals::get_router()->handle();

if (isset($_REQUEST['debug'])) {?>
<div style="position: ; top: 0; height: 600px; overflow: scroll; display: ">
    <pre>
    <?php
    echo "Hello world";
    var_dump($_REQUEST);
    var_dump($_SERVER);
    Globals::get_session()->increment();
    var_dump($_SESSION);
    ?>
</pre>
</div><?
}