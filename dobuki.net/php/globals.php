<?php
namespace Dobuki;

require_once 'router.php';
require_once 'server.php';
require_once 'database.php';
require_once 'email.php';
require_once 'login.php';
require_once 'javascript.php';

class Globals {
    static private $server;
    static private $session;
    static private $router;
    static private $database;
    static private $login;
    static private $email;
    static private $javascript;

    static private function get_brand(): string {
        return BRAND;
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
        if (!self::$server) {
            self::$server = new DokServer(
                self::get_brand(),
                self::get_server_vars(),
                self::get_request_vars()
            );
        }
        return self::$server;
    }

    static private function get_session(): Session {
        if (!self::$session) {
            self::$session = new DokSession(self::get_session_vars());
        }
        return self::$session;
    }

    static public function get_router(): Router {
        if (!self::$router) {
            self::$router = new DokRouter(
                self::get_server(),
                self::get_database()
            );
        }
        return self::$router;
    }

    static private function get_database(): Database {
        if (!self::$database) {
            self::$database = new DokDatabase(
                self::get_server_name(),
                self::get_database_name(),
                self::get_db_user(),
                self::get_db_password()
            );
        }
        return self::$database;
    }

    static public function get_login() {
        if (!self::$login) {
            self::$login = new DokLogin(
                self::get_database(),
                self::get_emailer()
            );
        }
        return self::$login;
    }

    static public function get_emailer() {
        if (!self::$email) {
            self::$email = new DokEmail();
        }
        return self::$email;
    }

    static public function get_javascript() {
        if (!self::$javascript) {
            self::$javascript = new DokJavascript();
        }
        return self::$javascript;
    }

    static private function get_database_name(): string {
        return DATABASE;
    }

    static private function get_server_name(): string {
        return SERVER_NAME;
    }

    static private function get_db_user(): string {
        return USERNAME;
    }

    static private function get_db_password(): string {
        return PASSWORD;
    }
}