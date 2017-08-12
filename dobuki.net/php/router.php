<?php
namespace Dobuki;

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
        require_once 'page.php';
        Page::render([
            'page' => 'homepage',
        ]);
        $this->handled = true;
    }

    private function handle_login() {
        require_once 'login.php';
        var_dump($this->server->get_request());
        $this->handled = true;
    }

    private function handle_signup() {
        require_once 'login.php';

        $request = $this->server->get_request();
        $login = new Login();
        $login->sign_up($request['username'], $request['email'], $request['password']);
        echo json_encode([
            'success' => true,
        ]);
        $this->handled = true;
    }

    private function handle_phpinfo() {
        phpinfo();
        $this->handled = true;
    }

    private function show_path() {
        $this->handled = true;
    }

    private function handle_www() {
        switch($this->server->get_path()) {
            case '/api/login':
                $this->handle_login();
                break;
            case '/api/signup':
                $this->handle_signup();
                break;
            case '/phpinfo':
                $this->handle_phpinfo();
                break;
            case '/':
            case '/login':
            case '/signup':
                $this->show_homepage();
                break;
        }
        if (!$this->handled) {
            $this->show_path();
        }


        if (!$this->handled) {
            $this->show_homepage();
        }
    }
}