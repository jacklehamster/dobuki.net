<?php
namespace Dobuki;

require_once 'constants.inc';

interface Database {
    public function query(string $query, array $parameters, bool $update);
}

class DokDatabase implements Database {
    private $connection;

    function __construct($server_name, $database_name, $db_user, $db_password) {
        $this->connection = new \PDO(
            "mysql:host=$server_name;dbname=$database_name", $db_user, $db_password
        );
        $this->connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    }

    public function query(string $query, array $parameters, bool $update) {
        $stmt = $this->connection->prepare($query);
        try {
            $stmt->execute($parameters);
        } catch(\PDOException $exception) {
            return null;
        }
        if ($update) {
            return $stmt->rowCount();
        } else {
            return $stmt->fetchAll();
        }
    }
}
