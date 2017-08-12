<?
$from = "From: yourname <welcome@dobuki.net>";
$to = "vincent@dobuki.net";
$subject = "Hi! ";
$body = "This is a test to check the PHP Mail functionality";

if(mail($to,$subject,$body,$from)) echo "MAIL - OK";
else echo "MAIL FAILED";