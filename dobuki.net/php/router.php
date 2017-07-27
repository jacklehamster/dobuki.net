<?php
namespace Dobuki;

require_once 'page.php';

interface Router {
    public function handle();
}

class DokRouter implements Router {
    private $server;
    private $handled;

    public function __construct(Server $server) {
        $this->server = $server;
        $this->handled = false;
    }

    public function handle() {
        switch($this->server->get_subdomain()) {
            case 'www':
                $this->handle_www();
                break;
        }
    }

    private function show_homepage() {
        Page::render([
            'page' => 'homepage',
        ]);
        $this->handled = true;
    }

    private function handle_login() {
        phpinfo();
        $this->handled = true;
    }

    private function handle_phpinfo() {
        phpinfo();
        $this->handled = true;
    }

    private function handle_www() {
        switch($this->server->get_path()) {
            case '/api/login':
                $this->handle_login();
                break;
            case '/phpinfo':
                $this->handle_phpinfo();
                break;
        }
        if (!$this->handled) {
            $this->show_homepage();
        }
    }
}