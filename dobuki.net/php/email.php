<?php
namespace Dobuki;

interface Email {
    function send_welcome_email(string $email, string $lockcode);
    function send_recovery_email(string $email, string $username, string $recovercode);
}

class DokEmail implements Email {

    function __construct() {
    }

    public function send_welcome_email(string $email, string $lockcode) {
        $to      = $email;
        $from    = 'Dobuki <welcome@dobuki.net>';
        $subject = 'Welcome to Dobuki.net';
        $message = "Hello. Click this link to confirm your email:\n".
            "https://www.dobuki.net/?email=$email&confirm=$lockcode";
        $headers =
            "From: $from\r\n" .
            "Reply-To: $from\r\n" .
            'X-Mailer: PHP/' . phpversion();
        mail($to, $subject, $message, $headers);
    }

    public function send_recovery_email(string $email, string $username, string $recoverycode) {
        $to      = $email;
        $from    = 'Dobuki <welcome@dobuki.net>';
        $subject = 'Recovery link for your account on Dobuki.net';
        $message = "Hello $username,\n\n".
            "You have requested a link to recover your account.\n".
            "Click this link to recover your account:\n".
            "https://www.dobuki.net/reset-password?username=$username&recover=$recoverycode";
        $headers =
            "From: $from\r\n" .
            "Reply-To: $from\r\n" .
            'X-Mailer: PHP/' . phpversion();
        mail($to, $subject, $message, $headers);
    }
}
