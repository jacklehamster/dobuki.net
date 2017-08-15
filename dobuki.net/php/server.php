<?php
namespace Dobuki;

interface Server {
    public function get_subdomain();
    public function get_path();
    public function get_method();
    public function get_request();
}

class DokServer implements Server {
    private $brand;
    private $hostname;
    private $subdomain;
    private $extension;
    private $method;
    private $path;
    private $request;

    public function __construct(string $brand, array $server, array $request) {
        $this->brand = $brand;
        $this->parse($server, $request);
        $this->request = $request;
    }

    private function parse(array $server, array $request) {
        $this->hostname = $server['HTTP_HOST'];
        $this->subdomain = null;
        $this->extension = null;
        if (preg_match("/^(?P<subdomain>\w+).{$this->brand}.(?P<extension>\w+)$/",
                $this->hostname, $matches)) {
            $this->subdomain = $matches['subdomain'];
            $this->extension = $matches['extension'];
        }
        $this->path = $server['REQUEST_URI'];
        if (preg_match('/^(?P<path>\/[^?]*)\??/', $server['REQUEST_URI'], $matches)) {
            $this->path = $matches['path'];
        }
        $this->method = $server['REQUEST_METHOD'];
    }

    public function get_subdomain() {
        return $this->subdomain;
    }

    public function get_path() {
        return $this->path;
    }

    public function get_method() {
        return $this->method;
    }

    public function get_request() {
        return $this->request;
    }
}