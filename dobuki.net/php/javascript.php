<?php
namespace Dobuki;

interface Javascript {
    public function inject_javascript();
}

class DokJavascript implements Javascript {
    private $scripts;

    function __construct() {
    }

    public function set_tip($message) {
        $message = json_encode($message);
        $this->scripts[] = "page.showTip($message);";
    }

    public function clear_query() {
        $this->scripts[] = 'Page.clearQuery();';
    }

    public function inject_javascript() {
        if (count($this->scripts) > 0) {
            echo '<script>' . implode(' ', $this->scripts) . '</script>';
        }

    }
}
