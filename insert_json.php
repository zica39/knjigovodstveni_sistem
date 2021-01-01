<?php
session_start();

if (!isset($_GET['email']))
{
    die('error');
}

require 'database.php';

if (!empty($_GET['json'])):

    $json = file_get_contents('php://input');

    $sql = "UPDATE users SET json=:json WHERE email=:email";
    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':json', $json);
    $stmt->bindParam(':email', $_GET['email']);

    if ($stmt->execute()):
        $message = 'true';
    else:
        $message = 'false';
    endif;

    echo $message;

endif;

?>
