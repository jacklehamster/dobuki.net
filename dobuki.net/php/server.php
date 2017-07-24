<?php

class Server {
    const DOMAIN = 'dobuki.net';

    private $hostname = self::DOMAIN;
    private $subdomain = null;
    private $paths = [];

    public function __construct() {
        $this->parse($_SERVER, $_REQUEST);
    }

    private function parse($server, $request) {
        $this->hostname = $server['HTTP_HOST'];
        if (preg_match('/^(?P<subdomain>\w+).'.self::DOMAIN.'$/',
                $this->hostname, $matches)) {
            $this->subdomain = $matches['subdomain'];
        }
        if (preg_match('/^\/(\w*)\/?(\w*)\/?(\w*)\/?(\w*)\/?(\w*)\/?\?/',
                $server['REQUEST_URI'], $matches)) {
            $this->paths = array_slice($matches, 1);
        }
    }
}
$server = new Server();
