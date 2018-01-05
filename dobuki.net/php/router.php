<?php
namespace Dobuki;

require_once 'globals.php';

interface Router {
    public function handle();
}

class DokRouter implements Router {
    private $server;
    private $session;
    private $login;
    private $emailer;
    private $handled;
    private $javascript;

    public function __construct(
        Server $server, Session $session, Login $login, Email $emailer, Javascript $javascript
    ) {
        $this->server = $server;
        $this->login = $login;
        $this->emailer = $emailer;
        $this->session = $session;
        $this->javascript = $javascript;
        $this->handled = false;
    }

    private function share_session_variables() {
        $this->javascript->inject_variables([
            'session' => $this->session->get_vars(),
        ]);
    }

    public function handle() {
        switch($this->server->get_subdomain()) {
            case 'www':
                $this->handle_www();
                $this->javascript->inject_javascript();
                break;
        }
    }

    private function show_homepage() {
        require_once 'page.php';
        $this->share_session_variables();
        Page::render([
            'page' => 'homepage',
        ]);
        $this->handled = true;
    }

    private function handle_login(array $request) {
        $result = $this->login->login(
            $request['username'],
            $request['password'] ?? null
        );
        echo json_encode($result);
        $this->handled = true;
    }

    private function handle_signup(array $request) {
        $result = $this->login->sign_up($request['username'], $request['email'], $request['password']);
        if ($result['success'] && $result['lockcode']) {
            $this->emailer->send_welcome_email($request['email'], $result['lockcode']);
            unset($result['lockcode']);
        }
        echo json_encode($result);
        $this->handled = true;
    }

    private function handle_logout() {
        $result = $this->login->logout();
        echo json_encode($result);
        $this->handled = true;
    }

    private function handle_recovery(array $request) {
        $result = $this->login->get_recovery_code($request['email']);
        if ($result['success']) {
            if ($result['validated']) {
                $this->emailer->send_recovery_email($request['email'], $result['username'], $result['code']);
            } else {
                $this->emailer->send_welcome_email($request['email'], $result['lockcode']);
            }
            unset($result['username']);
            unset($result['code']);
            unset($result['lockcode']);
            unset($result['validated']);
        }
        echo json_encode($result);
        $this->handled = true;
    }

    private function handle_check(array $request) {
        $result = $this->login->check_username_available($request['username']);
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
            $result = $this->login->validate($request['email'], $request['confirm']);
            $this->javascript->set_tip($result['message']);
            $this->javascript->clear_query();
        }
        if (isset($request['recover']) && isset($request['email'])) {
            $result = $this->login->recover($request['email'], $request['recover']);
            $this->javascript->set_tip($result['message']);
            $this->javascript->clear_query();
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
                $this->handle_login($this->server->get_request());
                break;
            case '/api/signup':
                $this->handle_signup($this->server->get_request());
                break;
            case '/api/logout':
                $this->handle_logout();
                break;
            case '/api/recover':
                $this->handle_recovery($this->server->get_request());
                break;
            case '/api/check':
                $this->handle_check($this->server->get_request());
                break;
            case '/phpinfo':
                $this->handle_phpinfo();
                break;
            case '/':
            case '/recover':
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