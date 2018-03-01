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
    private $profile;
    private $media;
    private $cache;

    public function __construct(
        Server $server, Session $session, Login $login,
        Email $emailer, Javascript $javascript, Profile $profile, Media $media, Cache $cache
    ) {
        $this->server = $server;
        $this->login = $login;
        $this->emailer = $emailer;
        $this->session = $session;
        $this->javascript = $javascript;
        $this->profile = $profile;
        $this->media = $media;
        $this->cache = $cache;
        $this->handled = false;
    }

    private function share_session_variables() {
        $this->javascript->inject_variables([
            'session' => $this->session->get_vars(),
        ]);
        $this->javascript->inject_javascript();
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
        $this->create_response($result);
    }

    private function handle_signup(array $request) {
        $result = $this->login->sign_up($request['username'], $request['email'], $request['password']);
        if ($result['success'] && $result['lockcode']) {
            $this->emailer->send_welcome_email($request['email'], $result['lockcode']);
            unset($result['lockcode']);
        }
        $this->create_response($result);
    }

    private function handle_logout() {
        $result = $this->login->logout();
        $this->create_response($result);
    }

    private function handle_recovery(array $request) {
        $result = $this->login->get_recovery_code($request['email']);
        if ($result['success']) {
            if ($result['validated']) {
                $this->emailer->send_recovery_email(
                    $request['email'], $result['username'], $result['code']
                );
            } else {
                $this->emailer->send_welcome_email($request['email'], $result['lockcode']);
            }
            unset($result['username']);
            unset($result['code']);
            unset($result['lockcode']);
            unset($result['validated']);
        }
        $this->create_response($result);
    }

    private function handle_check(array $request) {
        $result = $this->login->check_username_available($request['username']);
        $this->create_response($result);
    }

    private function handle_change_password(array $request) {
        $result = $this->login->change_password($request['username'], $request['password']);
        $this->create_response($result);
    }

    private function create_response(array $result) {
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
        if (isset($request['recover']) && isset($request['username'])) {
            $result = $this->login->recover($request['username'], $request['recover']);
            if (!$result['success']) {
                $this->javascript->go_to_homepage();
                $this->javascript->inject_javascript();
            }
            $this->javascript->set_tip($result['message']);
            $this->javascript->clear_query();
        }
    }

    private function handle_redirect($path) {
        if($path==='/dobuki-games') {
            $dobuki_games_version = "1.03.52416";

            $request = $this->server->get_request();
            if (isset($request['version'])) {
                header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
                header("Cache-Control: post-check=0, pre-check=0", false);
                header("Pragma: no-cache");
                $this->create_response([
                    'version' => $dobuki_games_version,
                ]);
            } else {
                header( 'Location: https://jacklehamster.itch.io/dobuki-game-collection' ) ;
                exit();
            }
        }
    }

    private function handle_save_profile(array $request) {
        $username = $this->session->get_username();
        $result = [ 'success' => true ];
        if ($request['profile_image']) {
            $result = $this->profile->save($request['profile_image']);
        }
        if ($request['password'] && $request['old_password']) {
            $result = $this->login->change_password($username, $request['password'], $request['old_password']);
        }
        $this->create_response($result);
    }

    private function handle_upload(array $request) {
        $result = $this->media->upload($request['image']??'');
        $this->create_response($result);
    }

    private function handle_failed_session() {
        $result = [
            'success' => false,
            'message' => 'Your session key is invalid',
        ];
        $this->create_response($result);
    }

    private function check_split($chunks, $path) {
        switch($chunks[1]) {
            case 'cache-grab':
                $url = implode('/', array_slice($chunks, 2));
                $result = $this->cache->get_url($url);

                $last_modified_header = 'Last-Modified: ' . @$_SERVER['HTTP_IF_MODIFIED_SINCE'];
                $etag_header = 'ETag: ' . @$_SERVER['HTTP_IF_NONE_MATCH'];

                foreach ($result['headers'] as $header) {
                    header($header);
                }
                foreach ($result['headers'] as $header) {
                    if ($header === $etag_header || $header === $last_modified_header) {
                        header("HTTP/1.1 304 Not Modified");
                        $this->handled = true;
                        return;
                    }
                }

                echo $result['content'];
                $this->handled = true;
                break;
            case 'profile-picture':
                list(,,$username,$format) = $chunks;
                $this->profile->show_picture($username, $format);
                $this->handled = true;
                break;
            case 'picture':
                list(,,$md5) = $chunks;
                $this->media->get_image($md5);
                break;
            case 'api':
                $this->session->ensure_session();
                list(,,$command) = $chunks;
                $this->api($command);
                break;
            case 'phpinfo':
                $this->handle_phpinfo();
                break;
            case '':
            case 'recover':
            case 'login':
            case 'signup':
            case 'reset-password':
            case 'profile':
            case 'games':
            case 'projects':
                $this->session->ensure_session();
                $this->show_homepage();
                break;
            case 'dobuki-games':
                $this->handle_redirect($path);
                break;
            default:
                break;
        }
    }

    private function needs_session_key($command):bool {
        switch($command) {
            case 'login':
            case 'signup':
            case 'recover':
            case 'check':
                return false;
            case 'upload':
                return false;
        }
        return true;
    }

    private function api($command) {
        $request = $this->server->get_request();
        if ($this->needs_session_key($command)
            && !$this->session->check_session_key($request['session_key']??null)) {
            $this->handle_failed_session();
        } else {
            switch($command) {
                case 'login':
                    $this->handle_login($request);
                    break;
                case 'signup':
                    $this->handle_signup($this->server->get_request());
                    break;
                case 'logout':
                    $this->handle_logout();
                    break;
                case 'recover':
                    $this->handle_recovery($this->server->get_request());
                    break;
                case 'check':
                    $this->handle_check($this->server->get_request());
                    break;
                case 'change-password':
                    $this->handle_change_password($this->server->get_request());
                    break;
                case 'save-profile':
                    $this->handle_save_profile($this->server->get_request());
                    break;
                case 'upload':
                    $this->handle_upload($this->server->get_request());
                    break;
            }
        }
    }

    private function handle_www() {
        $this->check_request($this->server->get_request());
        $path = $this->server->get_path();
        $this->check_split(explode('/',$path), $path);
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
        $this->session->commit();
    }
}