<?php
namespace Dobuki;

interface Email {
    public function send_welcome_email(string $email, string $lockcode);
}

class DokEmail implements Email {

    function __construct() {
    }

    public function send_welcome_email(string $email, string $lockcode) {
        $to      = $email;
        $from    = 'welcome@dobuki.net';
        $subject = 'Welcome to Dobuki.net';
        $message = "Hello. Click this link to confirm your email: https://www.dobuki.net/?email=$email&confirm=$lockcode";
        $headers = "From: $from\r\n" .
            "Reply-To: $from\r\n" .
            'X-Mailer: PHP/' . phpversion();
        mail($to, $subject, $message, $headers);
    }
}
