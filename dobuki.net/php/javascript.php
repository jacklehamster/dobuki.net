<?php
namespace Dobuki;

interface Javascript {
    function inject_javascript();
    function inject_variables($array);
    function set_variable($key, $value);
    function set_tip($message);
    function clear_query(string $replacement='');
    function log($message);
    function go_to_homepage();
}

class DokJavascript implements Javascript {
    private $scripts;

    function __construct() {
        $this->scripts = [];
    }

    private static function onDOMContentLoaded($script) {
        return "document.addEventListener('DOMContentLoaded', (event) => {
            $script
        });";
    }

    public function inject_variables($array) {
        foreach ($array as $key=>$value) {
            $this->set_variable($key, $value);
        }
    }

    public function set_variable($key, $value) {
        $value = json_encode($value);
        $this->scripts[] = "var $key = $value";
    }

    public function set_tip($message) {
        $message = json_encode($message);
        $this->scripts[] = self::onDOMContentLoaded("page.showTip($message);");
    }

    public function clear_query(string $replacement='') {
        $replacement = json_encode($replacement);
        $this->scripts[] = self::onDOMContentLoaded("Page.clearQuery($replacement);");
    }

    public function go_to_homepage() {
        $this->scripts[] = 'history.pushState({mode: null}, "Dobuki", "/");';
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
