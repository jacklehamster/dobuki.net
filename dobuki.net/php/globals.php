<?php
namespace Dobuki;

require_once 'router.php';
require_once 'server.php';

class Globals {
    static private $vars = [];

    static public function get($name) {
        if (!self::$vars[$name]) {
            self::$vars[$name] = call_user_func([__CLASS__, "get_$name"]);
        }
        return self::$vars[$name];
    }

    static private function get_server_vars(): array {
        return $_SERVER;
    }

    static private function get_request_vars(): array {
        return $_REQUEST;
    }

    static private function get_session_vars(): array {
        return $_SESSION;
    }

    static private function get_server(): Server {
        return new DokServer(self::get_server_vars(), self::get_request_vars());
    }

    static private function get_session(): Session {
        return new DokSession(self::get_session_vars());
    }

    static public function get_router(): Router {
        return new DokRouter(self::get_server());
    }
}