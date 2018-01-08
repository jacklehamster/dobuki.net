<?php
namespace Dobuki;

interface Session {
    function get_failures():int;
    function add_failure();
    function clear_failures();
    function commit();
    function reset();
    function set_username($user, $id);
    function get_username();
    function set_refresh_now();
    function get_id():int;
    function get_vars():array;
    function increment():int;
    function prepare_recovery(string $username);
    function can_recover(string $username): bool;
    function destroy();
}

class DokSession implements Session {
    private $session_vars;
    public function __construct() {
    }

    private function get_session_vars(): array {
        if ($this->session_vars === null) {
            session_start();
            $this->session_vars = $_SESSION;
        }
        return $this->session_vars;
    }

    public function reset() {
        session_unset();
    }

    public function get_failures():int {
        $this->get_session_vars();
        return $this->session_vars['failures'] ?? 0;
    }

    public function add_failure() {
        $this->get_session_vars();
        $this->session_vars['failures'] = $this->get_failures() + 1;
    }

    public function clear_failures() {
        $this->get_session_vars();
        unset($this->session_vars['failures']);
    }

    public function commit() {
        session_write_close();
    }

    public function set_username($user, $id) {
        $this->set_session_var('user', $user);
        $this->set_session_var('id', $id);
    }

    public function get_username() {
        return $this->get_session_vars()['user'] ?? null;
    }

    public function set_refresh_now() {
        $this->set_session_var('refresh', time());
    }

    public function get_id():int {
        return $this->get_session_vars()['id'] ?? 0;
    }

    public function get_vars():array {
        $this->get_session_vars();
        return array_filter([
            'user' => $this->session_vars['user'] ?? null,
            'refresh' => $this->session_vars['refresh'] ?? null,
        ]);
    }

    public function increment():int {
        $this->get_session_vars();
        $this->set_session_var('count', ($this->session_vars['count'] ?? 0) + 1);
        return $this->session_vars['count'];
    }

    public function prepare_recovery(string $username) {
        $this->get_session_vars();
        $this->set_session_var('can_recover', $username);
    }

    public function can_recover(string $username): bool {
        $this->get_session_vars();
        return ($this->session_vars['can_recover'] ?? null) === $username;
    }

    private function set_session_var($key, $value) {
        $this->get_session_vars();
        if ($value === null) {
            unset($this->session_vars[$key]);
            unset($_SESSION[$key]);
        } else {
            $this->session_vars[$key] = $_SESSION[$key] = $value;
        }
    }

    public function destroy() {
        $this->get_session_vars();
        session_unset();
        session_destroy();
    }
}