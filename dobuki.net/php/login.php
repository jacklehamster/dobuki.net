<?php
namespace Dobuki;

interface Login {
}

class DokLogin implements Login {
    private $database;
    private $emailer;

    function __construct(Database $database, Email $emailer) {
        $this->database = $database;
        $this->emailer = $emailer;
    }

    public function sign_up($username, $email, $password): array {
        $created = date('Y-m-d H:i:s');

        $password = md5("$password $created $username");
        $lockcode = md5("lockcode => $created $username");

        $result = $this->database->query('
            INSERT INTO users
            (username, email, password, created, lockcode)
            VALUES (:username, :email, :password, :created, :lockcode)
        ', [
            ':username' => $username,
            ':email' => $email,
            ':password' => $password,
            ':created' => $created,
            ':lockcode' => $lockcode,
        ], true);
        if($result === 0) {
            return [
                'success' => false,
                'message' => 'This user or email already exists',
            ];
        } else {
            $this->emailer->send_welcome_email($email, $lockcode);
            return [ 'success' => true ];
        }
    }

    /**
     * @param string $username
     * @param string|null $password
     * @param string|null $time
     * @return array
     */
    public function login(string $username, string $password=null, string $time=null): array {
        $login_result = $this->database->query('
            SELECT * FROM users
            WHERE (username=:user OR email=:user)
        ', [
            ':user' => $username,
        ], false);
        if (count($login_result) === 1) {
            $row = $login_result[0];
            if ($row['validated']) {
                return [ 'success' => true ];
            } else {
                return [
                    'success' => false,
                    'message' => 'This user has not yet been validated.',
                ];
            }
        } else {
            return [
                'success' => false,
                'message' => 'User not found',
            ];
        }
    }
}