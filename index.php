<?php
session_start();

require 'database.php';

if (isset($_SESSION['user_id']))
{

    $records = $conn->prepare('SELECT id,email,password FROM users WHERE id = :id');
    $records->bindParam(':id', $_SESSION['user_id']);
    $records->execute();
    $results = $records->fetch(PDO::FETCH_ASSOC);

    $user = NULL;

    if (count($results) > 0)
    {
        $user = $results;
    }
	if(!empty($user)) header("Location: ./panel.php");
	else  header("Location: ./login.php"); 
}
else
	header("Location: ./login.php"); 
?>

