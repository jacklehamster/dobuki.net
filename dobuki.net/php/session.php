<?php
namespace Dobuki;

interface Session {
    function get_failures():int;
    function add_failure();
    function clear_failures();
    function write_close();
    function reset();
    function set_username($user);
    function get_vars():array;
    function increment():int;
    function prepare_recovery(string $email);
    function can_recover(string $email): bool;
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

    public function write_close() {
        session_write_close();
    }

    public function set_username($user) {
        $this->set_session_var('user', $user);
    }

    public function get_vars():array {
        $this->get_session_vars();
        return [
            'user' => $this->session_vars['user'] ?? null,
        ];
    }

    public function increment():int {
        $this->get_session_vars();
        $this->set_session_var('count', ($this->session_vars['count'] ?? 0) + 1);
        return $this->session_vars['count'];
    }

    public function prepare_recovery(string $email) {
        $this->get_session_vars();
        $this->set_session_var('can_recover', $email);
    }

    public function can_recover(string $email): bool {
        $this->get_session_vars();
        return ($this->session_vars['can_recover'] ?? null) === $email;
    }

    private function set_session_var($key, $value) {
        $this->get_session_vars();
        $this->session_vars[$key] = $_SESSION[$key] = $value;
    }
}