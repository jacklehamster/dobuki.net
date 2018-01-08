<?php
namespace Dobuki;


class Globals {
    static private $server;
    static private $session;
    static private $router;
    static private $database;
    static private $login;
    static private $email;
    static private $javascript;
    static private $profile;

    static private function get_brand(): string {
        require_once 'database.php';
        return BRAND;
    }

    static private function get_server_vars(): array {
        return $_SERVER;
    }

    static private function get_request_vars(): array {
        return $_REQUEST;
    }

    static private function get_server(): Server {
        if (!self::$server) {
            require_once 'server.php';
            self::$server = new DokServer(
                self::get_brand(),
                self::get_server_vars(),
                self::get_request_vars()
            );
        }
        return self::$server;
    }

    static public function get_session(): Session {
        if (!self::$session) {
            require_once 'session.php';
            self::$session = new DokSession();
        }
        return self::$session;
    }

    static public function get_router(): Router {
        if (!self::$router) {
            require_once 'router.php';
            self::$router = new DokRouter(
                self::get_server(),
                self::get_session(),
                self::get_login(),
                self::get_emailer(),
                self::get_javascript(),
                self::get_profile()
            );
        }
        return self::$router;
    }

    static private function get_database(): Database {
        if (!self::$database) {
            require_once 'database.php';
            self::$database = new DokDatabase(
                self::get_server_name(),
                self::get_database_name(),
                self::get_db_user(),
                self::get_db_password()
            );
        }
        return self::$database;
    }

    static public function get_login(): Login {
        if (!self::$login) {
            require_once 'login.php';
            self::$login = new DokLogin(self::get_database(), self::get_session());
        }
        return self::$login;
    }

    static public function get_emailer(): Email {
        if (!self::$email) {
            require_once 'email.php';
            self::$email = new DokEmail();
        }
        return self::$email;
    }

    static public function get_javascript(): Javascript {
        if (!self::$javascript) {
            require_once 'javascript.php';
            self::$javascript = new DokJavascript();
        }
        return self::$javascript;
    }

    static public function get_profile(): Profile {
        if (!self::$profile) {
            require_once 'profile.php';
            self::$profile = new DokProfile(self::get_database(), self::get_session());
        }
        return self::$profile;
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