<?php
class Page {
    public $title = 'Dobuki';
    public $description = 'Art and Games on Dobuki Studio';
    public $stylesheet = 'style.css';
    /** @var Closure */
    public $render_body = null;
    public $theme_color = '#d5f97a;';

    public function __construct($options) {
        foreach($options as $key => $value) {
            $this->$key = $value;
        }
    }

    public function render() {
        require 'template.php';
    }

    public function renderBody() {
        if ($this->render_body) {
            $this->render_body->call($this);
        }
    }
}