<?php
namespace Dobuki;

require_once 'constants.inc';

interface Session {
}

class DokSession implements Session {

    private $user_id = null;

    public function __construct($session_vars) {
        session_start();
        $this->user_id = isset($session_vars['user_id']) ? $session_vars['user_id'] : null;
    }
}