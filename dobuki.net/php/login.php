<?php
namespace Dobuki;

interface Login {
    function login(string $username, string $pass_user_hash=null): array;
    function sign_up($username, $email, $password): array;
    function logout(): array;
    function validate(string $email, string $lockcode): array;
    function get_recovery_code($email): array;
    function check_username_available($username): array;
    function recover(string $email, string $recoverycode): array;
    function change_password(string $username, string $pass_user_hash, string $old_pass=null): array;
}

class DokLogin implements Login {
    private $database;
    private $session;

    function __construct(Database $database, Session $session) {
        $this->database = $database;
        $this->session = $session;
    }

    public function get_recovery_code($email): array {
        $result = $this->database->query("
            SELECT username,
            md5(CONCAT(email, ' ', lastlogin)) as code,
            validated,
            md5(CONCAT('lockcode => ', created, ' ', username)) as lockcode
            FROM users
            WHERE email=:email
        ", [
            ':email' => $email,
        ], false);
        if (count($result) === 0) {
            $this->failure();
            return [
                'success' => false,
                'message' => "There are no accounts with the email $email.",
            ];
        }
        $row = $result[0];
        return [
            'success' => true,
            'username' => $row['username'],
            'code' => $row['code'],
            'message' => $row['validated'] ? "Your recover link has been sent to $email."
                : "Your email has not yet been validated. A validation link has been sent to email.",
            'lockcode' => $row['lockcode'],
            'validated' => $row['validated'],
        ];
    }

    public function change_password(string $username, string $pass_user_hash, string $old_pass=null): array {
        if ($this->session->can_recover($username)) {
            $result = $this->database->query("
                UPDATE users 
                SET password=md5(CONCAT(created, ' ', :password))
                WHERE username=:username AND password IS NULL
            ", [
                ':username' => $username,
                ':password' => $pass_user_hash,
            ], true);
        } else {
            $result = $this->database->query("
                UPDATE users 
                SET password=md5(CONCAT(created, ' ', :password))
                WHERE username=:username AND password=md5(CONCAT(created, ' ', :old_password))
            ", [
                ':username' => $username,
                ':password' => $pass_user_hash,
                ':old_password' => $old_pass,
            ], true);
        }

        if (!$result) {
            return [
                'success' => false,
                'message' => 'Failed to reset this password',
            ];
        } else {
            $result = $this->login($username, $pass_user_hash);
            if ($result['success']) {
                $result['tip'] = 'Thank you, your password has been successfully updated.';
            }
            return $result;
        }
    }

    public function sign_up($username, $email, $pass_user_hash): array {
        $created = date('Y-m-d H:i:s');

        $password = md5("$created $pass_user_hash");
        $lockcode = md5("lockcode => $created $username");

        $result = $this->database->query('
            INSERT INTO users
            (username, email, password, created)
            VALUES (:username, :email, :password, :created)
        ', [
            ':username' => $username,
            ':email' => $email,
            ':password' => $password,
            ':created' => $created,
        ], true);

        if (!$result) {
            return [
                'success' => false,
                'message' => 'An account with this username or email already exists.',
            ];
        } else {
            return [
                'success' => true,
                'lockcode' => $lockcode,
            ];
        }
    }

    public function check_username_available($username): array {
        $login_result = $this->database->query('
            SELECT username, email FROM users
            WHERE (username=:user OR email=:email)
            LIMIT 1
        ', [
            ':user' => $username,
            ':email' => $username,
        ], false);
        if (count($login_result) > 0) {
            $row = $login_result[0];
            $result = [
                'success' => false,
                'message' => $username === $row['username']
                    ? 'This username is already taken.'
                    : 'An account with this email already exists',
                'type' => $username === $row['username'] ? 'username' : 'email',
            ];
        } else {
            $result = [
                'success' => true,
            ];
        }
        return $result;
    }

    private function failure() {
        $this->session->add_failure();
        $this->session->commit();
        usleep(min(10000000, pow(2, $this->session->get_failures()) * 1000));
    }

    /**
     * @param string $username
     * @param string|null $pass_user_hash
     * @return array
     */
    public function login(string $username, string $pass_user_hash=null): array {
        $login_result = $this->database->query('
            SELECT * FROM users
            WHERE (username=:user OR email=:email)
        ', [
            ':user' => $username,
            ':email' => $username,
        ], false);
        $result = [ 'success' => false, 'message' => 'Login failed' ];
        if (count($login_result) === 1) {
            $row = $login_result[0];
            if ($row['validated']) {
                if ($pass_user_hash) {
                    $password_hash = $row['password'];
                    $created = $row['created'];
                    $username = $row['username'];
                    $id = $row['id'];
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
                            $this->session->reset();
                            $this->session->ensure_session();
                            $this->session->set_username($username, $id);
                            $this->session->set_refresh_now();

                            $result = [
                                'success' => true,
                                'username' => $username,
                                'password_valid' => true,
                                'vars' => $this->session->get_vars(),
                            ];
                        } else {
                            $result = [
                                'success' => false,
                                'message' => 'Login failed.',
                            ];
                        }

                    }
                } else {
                    $this->session->clear_failures();
                    if (!$row['password']) {
                        if ($this->session->can_recover($row['username'])) {
                            $result = [
                                'username' => $row['username'],
                                'success' => true,
                                'reset_password' => true,
                            ];
                        } else {
                            $result = [
                                'success' => false,
                                'message' => 'This account has been locked. Please use the '.
                                    'recovery link sent your email to recover it. To request the '.
                                    'email to be sent again, use the link below.',
                            ];
                        }
                    } else {
                        $result = [
                            'username' => $row['username'],
                            'success' => true,
                        ];
                    }
                }
            } else {
                $result = [
                    'success' => false,
                    'message' => 'This user has not yet been confirmed.'.
                        'Please check your email for a validation link.',
                ];
            }
        } else {
            $result = [
                'success' => false,
                'message' => 'User not found.',
            ];
        }
        if (!$result['success']) {
            $this->failure();
        }
        return $result;
    }

    /**
     * @return array
     */
    public function logout(): array {
        $this->session->destroy();
        $result = [
            'success' => true,
        ];

        return $result;
    }

    public function validate(string $email, string $lockcode): array {
        $this->session->clear_failures();
        $update_count = $this->database->query("
                UPDATE users SET validated=NOW()
                WHERE email=:email
                AND md5(CONCAT('lockcode => ', created, ' ', username))=:lockcode
                AND validated IS NULL
            ", [
                ':lockcode' => $lockcode,
                ':email' => $email,
            ],
            true
        );

        $success = $update_count > 0;

        if (!$success) {
            $query_result = $this->database->query("
                    SELECT validated FROM users
                    WHERE email=:email
                    AND md5(CONCAT('lockcode => ', created, ' ', username)) = :lockcode
                ", [
                    ':lockcode' => $lockcode,
                    ':email' => $email,
                ], false
            );
            if (count($query_result) > 0) {
                $row = $query_result[0];
                if($row['validated']) {
                    $success = true;
                }
            }
        }

        $message = $success ? "Email $email validated." : "Email validation failed.";
        return [
            'success' => $update_count > 0,
            'message' => $message,
        ];
    }

    public function recover(string $username, string $recoverycode): array {
        $this->session->clear_failures();
        $this->session->set_username(null, null);
        $update_count = $this->database->query("
                UPDATE users SET validated=NOW(), password=null
                WHERE username=:username AND validated IS NOT NULL
                AND md5(CONCAT(email, ' ', lastlogin)) = :recoverycode
            ", [
                ':recoverycode' => $recoverycode,
                ':username' => $username,
            ],
            true
        );

        $success = $update_count > 0;
        if ($success) {
            $this->session->prepare_recovery($username);
        }

        $message = $success ? "Please enter your new password."
            : "Account recovery failed. The recovery link you used is invalid or has expired.";

        return [
            'success' => $update_count > 0,
            'message' => $message,
        ];
    }
}