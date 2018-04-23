<?php
namespace Dobuki;

interface Server {
    public function get_subdomain();
    public function get_path();
    public function get_method();
    public function get_request();
    public function get_request_uri();
    public function get_referer();
}

class DokServer implements Server {
    private $brand;
    private $hostname;
    private $subdomain;
    private $extension;
    private $method;
    private $path;
    private $request;
    private $request_uri;
    private $referer;

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
        $this->request_uri = $server['REQUEST_URI'];
        $this->path = $server['REQUEST_URI'];
        if (preg_match('/^(?P<path>\/[^?]*)\??/', $server['REQUEST_URI'], $matches)) {
            $this->path = $matches['path'];
        }
        $this->method = $server['REQUEST_METHOD'];
        $this->referer = $server['HTTP_REFERER'] ?? null;
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

    public function get_request_uri() {
        return $this->request_uri;
    }

    public function get_referer() {
        return $this->referer;
    }
}