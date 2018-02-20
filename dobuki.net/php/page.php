<?php
namespace Dobuki;

/**
 * Class Page
 */
class Page {
    public $title = 'Dobuki';
    public $description = 'Art and Games on Dobuki Studio';
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

    private function renderPage() {
        http_response_code(200);
        require 'template.html.php';
    }

    public function insertStylesheet() {
        echo "<style>";
        readfile("pages/{$this->page}.css");
        echo "</style>";
    }

    public function insertScript() {
        ?><script src="/<?=$this->page?>.js"></script><?
    }

    public function renderContent() {
        ?><script>var page = <?=ucfirst($this->page)?>.render();</script><?
    }

    static public function render(array $options) {
        (new Page($options))->renderPage();
    }
}