<?php
namespace Dobuki;

class Login {
    private $connection;

    function __construct() {
        $server_name = SERVER_NAME;
        $database = DATABASE;

        $this->connection = new \PDO(
            "mysql:host=$server_name;dbname=$database",
            USERNAME, PASSWORD
        );
        $this->connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    }

    public function sign_up($username, $email, $password) {
        $created = date("Y-m-d H:i:s");

        $stmt = $this->connection->prepare('
            INSERT INTO users
            (username, email, password, created, lockcode)
            VALUES (:username, :email, :password, :created, :lockcode)
        ');
        $password = md5("$password $created $username");
        $lockcode = md5("lockcode => $created $username");
        $stmt->bindParam(':username', $username, \PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, \PDO::PARAM_STR);
        $stmt->bindParam(':password', $password, \PDO::PARAM_STR);
        $stmt->bindParam(':created', $created, \PDO::PARAM_STR);
        $stmt->bindParam(':lockcode', $lockcode, \PDO::PARAM_STR);
        $stmt->execute();

        $to      = $email;
        $from    = 'welcome@dobuki.net';
        $subject = 'Welcome to Dobuki.net';
        $message = "Hello. Click this link to confirm your email: https://www.dobuki.net/?confirm=$lockcode";
        $headers = "From: $from\r\n" .
            "Reply-To: $from\r\n" .
            'X-Mailer: PHP/' . phpversion();
        mail($to, $subject, $message, $headers);
    }
}

?>