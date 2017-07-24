<?php

/**
 * Class Page
 */
class Page {
    public $title = 'Dobuki';
    public $description = 'Art and Games on Dobuki Studio';
    public $stylesheet = './style.css';
    public $page = null;
    /** @var Closure */
    public $render_body = null;
    public $theme_color = '#d5f97a;';
    public $favicon = './favicon.ico';

    public function __construct(array $options) {
        foreach($options as $key => $value) {
            $this->$key = $value;
        }
    }

    public function render() {
        http_response_code(200);
        require 'template.html.php';
    }

    public function renderContent() {
        ?>
            <script>
                <? include "pages/{$this->page}.js" ?>
            </script>
        <?
    }
}