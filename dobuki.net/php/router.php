<?php
namespace Dobuki;

interface Router {
    public function handle();
}

class DokRouter implements Router {
    private $server;
    private $database;
    private $handled;

    public function __construct(Server $server, Database $database) {
        $this->server = $server;
        $this->database = $database;
        $this->handled = false;
    }

    public function handle() {
        switch($this->server->get_subdomain()) {
            case 'www':
                $this->handle_www();
                break;
        }
        Globals::get_javascript()->inject_javascript();
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
        $request = $this->server->get_request();
        $login = Globals::get_login();
        $result = $login->login(
            $request['username'],
            $request['password'] ?? null
        );
        echo json_encode($result);
        $this->handled = true;
    }

    private function handle_signup() {
        require_once 'login.php';
        $request = $this->server->get_request();
        $login = Globals::get_login();
        $result = $login->sign_up($request['username'], $request['email'], $request['password']);
        echo json_encode($result);
        $this->handled = true;
    }

    private function handle_logout() {
        require_once 'login.php';
        $request = $this->server->get_request();
        $login = Globals::get_login();
        $result = $login->logout(
            $request['username'],
            $request['token'] ?? null
        );
        echo json_encode($result);
        $this->handled = true;
    }

    private function handle_phpinfo() {
        phpinfo();
        $this->handled = true;
    }

    private function show_path() {
        $this->handled = true;
    }

    public function check_slash($path) {
        $full_path = "{$_SERVER['DOCUMENT_ROOT']}/public{$path}";
        if (is_dir($full_path) && $full_path[-1]!=='/') {
            $query = $_SERVER['QUERY_STRING'] ? "?{$_SERVER['QUERY_STRING']}" : '';
            header("Location: $path/$query");
            die();
        }
    }

    private function check_public($path) {
        $full_path = "{$_SERVER['DOCUMENT_ROOT']}/public{$path}";
        $index_file = "{$full_path}index.html";
        if (file_exists($index_file)) {
            echo file_get_contents($index_file);
            $this->handled = true;
        }
    }

    private function check_request($request) {
        if (isset($request['confirm']) && isset($request['email'])) {
            $login = Globals::get_login();
            $result = $login->validate($request['email'], $request['confirm']);
            $javascript = Globals::get_javascript();
            $javascript->set_tip($result['message']);
            $javascript->clear_query();
        }
    }

    private function handle_redirect($path) {
        if($path==='/dobuki-games') {
            $dobuki_games_version = "1.03.50258";

            $request = $this->server->get_request();
            if (isset($request['version'])) {
                header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
                header("Cache-Control: post-check=0, pre-check=0", false);
                header("Pragma: no-cache");
                echo json_encode([
                    'version' => $dobuki_games_version,
                ]);
            } else {
                header( 'Location: https://jacklehamster.itch.io/dobuki-game-collection' ) ;
            }
            $this->handled = true;
        }
    }

    private function get_image($username, $format) {
        header('Location: /assets/defaultprofile.png');
    }

    private function check_split($paths) {
        switch($paths[1]) {
            case 'profile':
                list(,,$username,$format) = $paths;
                $this->get_image($username, $format);
                break;
        }
    }

    private function handle_www() {
        $path = $this->server->get_path();
        switch($path) {
            case '/api/login':
                $this->handle_login();
                break;
            case '/api/signup':
                $this->handle_signup();
                break;
            case '/api/logout':
                $this->handle_logout();
                break;
            case '/phpinfo':
                $this->handle_phpinfo();
                break;
            case '/':
            case '/login':
            case '/signup':
                $this->show_homepage();
                break;
            case '/dobuki-games':
                $this->handle_redirect($path);
                break;
            default:
                $this->check_split(explode('/',$path));
                break;
        }
        if (!$this->handled) {
            $this->check_slash($path);
        }

        if (!$this->handled) {
            $this->check_public($path);
        }

        if (!$this->handled) {
            $this->show_path();
        }

        if (!$this->handled) {
            $this->show_homepage();
        }

        $this->check_request($this->server->get_request());
    }
}