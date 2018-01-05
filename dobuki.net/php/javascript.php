<?php
namespace Dobuki;

interface Javascript {
    function inject_javascript();
    function inject_variables($array);
    function set_variable($key, $value);
    function set_tip($message);
    function clear_query();
    function log($message);
}

class DokJavascript implements Javascript {
    private $scripts;

    function __construct() {
        $this->scripts = [];
    }

    public function inject_variables($array) {
        foreach ($array as $key=>$value) {
            $this->set_variable($key, $value);
        }
        $this->inject_javascript();
    }

    public function set_variable($key, $value) {
        $value = json_encode($value);
        $this->scripts[] = "var $key = $value";
    }

    public function set_tip($message) {
        $message = json_encode($message);
        $this->scripts[] = "page.showTip($message);";
    }

    public function clear_query() {
        $this->scripts[] = 'Page.clearQuery();';
    }

    public function log($message) {
        $message = json_encode($message);
        $this->scripts[] = "console.log($message);";
    }

    public function inject_javascript() {
        if (count($this->scripts) > 0) {
            echo '<script>' . implode("\n", $this->scripts) . '</script>';
            $this->scripts = [];
        }

    }
}
