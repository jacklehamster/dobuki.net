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

        $pass_user_hash = md5("$password $username");
        $password = md5("$created $pass_user_hash");
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
        if ($result === 0) {
            return [
                'success' => false,
                'message' => 'This user or email already exists.',
            ];
        } else {
            $this->emailer->send_welcome_email($email, $lockcode);
            return [ 'success' => true ];
        }
    }

    /**
     * @param string $username
     * @param string|null $pass_user_hash
     * @return array
     */
    public function login(string $username, string $pass_user_hash=null): array {
        $login_result = $this->database->query('
            SELECT * FROM users
            WHERE (username=:user OR email=:user)
        ', [
            ':user' => $username,
        ], false);
        $result = [ 'success' => false, 'message' => 'Login failed' ];
        if (count($login_result) === 1) {
            $row = $login_result[0];
            if ($row['validated']) {
                if ($pass_user_hash) {
                    $password_hash = $row['password'];
                    $created = $row['created'];
                    $username = $row['username'];
                    if (md5("$created $pass_user_hash") !== $password_hash) {
                        $result = [
                            'success' => false,
                            'message' => 'Your password is invalid.',
                            'phash' => $password_hash,
                            'md5' => md5("$created $pass_user_hash"),
                        ];
                    } else {
                        $count_updated = $this->database->query('
                            UPDATE users SET lastlogin=NOW()
                            WHERE username=:user
                        ', [
                            ':user' => $username,
                        ], true);

                        if ($count_updated) {
                            list($row) = $this->database->query('
                                SELECT lastlogin FROM users
                                WHERE username=:user
                            ', [
                                ':user' => $username,
                            ], false);
                            $lastlogin = $row['lastlogin'];
                            $token = md5("$lastlogin $password_hash");
                            $result = [
                                'success' => true,
                                'username' => $username,
                                'token' => $token,
                            ];
                        } else {
                            $result = [
                                'success' => false,
                                'message' => 'Login failed.',
                            ];
                        }

                    }
                } else {
                    $result = [
                        'username' => $username,
                        'success' => true,
                    ];
                }
            } else {
                $result = [
                    'success' => false,
                    'message' => 'This user has not yet been confirmed. Please check your email for a validation link.',
                ];
            }
        } else {
            $result = [
                'success' => false,
                'message' => 'User not found.',
            ];
        }
        if (!$result['success']) {
            sleep(1);
        }
        return $result;
    }

    /**
     * @param string $username
     * @param string $token
     * @return array
     */
    public function logout(string $username, string $token): array {
        $login_result = $this->database->query('
            SELECT * FROM users
            WHERE username=:user and md5(CONCAT(lastlogin, :space, password))=:token
        ', [
            ':user' => $username,
            ':token' => $token,
            ':space' => ' ',
        ], false);

        $result = [
            'result' => $login_result,
        ];

        return $result;
    }

    public function validate(string $email, string $lockcode): array {
        $update_count = $this->database->query('
                    UPDATE users SET validated=NOW()
                    WHERE email=:email
                    AND md5(CONCAT(:lockcode_salt, created, :space, username))=:lockcode
                    AND validated IS NULL
                ',
            [
                ':lockcode' => $lockcode,
                ':email' => $email,
                ':lockcode_salt' => 'lockcode => ',
                ':space' => ' ',
            ],
            true
        );
        $message = $update_count > 0 ? "Email $email validated." : "Email validation failed.";
        return [
            'success' => $update_count > 0,
            'message' => $message,
        ];
    }
}