<?php
session_start();

if (isset($_SESSION['user_id']))
{
    header("Location: /");
}

require 'database.php';

$message = '';
$year = date('Y');

if (!empty($_GET['key']) && !empty($_GET['token']))
{

    $records = $conn->prepare('SELECT id,email,password FROM forgot WHERE email = :email AND password = :password');
    $records->bindParam(':email', $_GET['key']);
    $records->bindParam(':password', $_GET['token']);
    $records->execute();
    $exists = $records->fetch(PDO::FETCH_ASSOC);

    if (is_array($exists))
    {

        if (!empty($_POST['new_password']))
        {

            $sql = "UPDATE users SET password=:password WHERE email=:email";
            $stmt = $conn->prepare($sql);

            $stmt->bindParam(':password', password_hash($_POST['new_password'], PASSWORD_BCRYPT));
            $stmt->bindParam(':email', $_GET['key']);

            if ($stmt->execute())
            {

                $sql = "DELETE FROM forgot WHERE email=:email";
                $stmt1 = $conn->prepare($sql);
                $stmt1->bindParam(':email', $_GET['key']);

                if ($stmt1->execute()) header("Location: /login.php");
                else $message = 'Sorry there must have been an issue creating your account';
            }
            else $message = 'Sorry there must have been an issue creating your account';

        }

    }
    else
    {
        header("Location: /");
    }

}
else
{
    header("Location: /");
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="author" content="Kodinger">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<title>Reset</title>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" >
	<link rel="stylesheet" type="text/css" href="css/login.css">
	<link rel="icon" href="./data/icon.svg">
</head>
<body class="my-login-page">
	<section class="h-100">
		<div class="container h-100">
			<div class="row justify-content-md-center align-items-center h-100">
				<div class="card-wrapper">
					<div class="brand mx-auto my-3">
						<img src="./data/icon.svg" alt="">
					</div>
					<div class="alert alert-warning alert-dismissible<?php echo ($message == '') ? ' d-none' : ''; ?>">
						<strong><?=$message ?></strong>
						<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
					</div>
					<div class="card fat">
						<div class="card-body">
							<h4 class="card-title">Reset Password</h4>
							<form method="POST" class="my-login-validation" novalidate="">
								<div class="form-group">
									<label for="new-password">New Password</label>
									<input id="new_password" type="password" class="form-control" name="new_password" required autofocus data-eye data-register>
									<div class="invalid-feedback">
										Password is required
									</div>
									<div id = 'strength' class="form-text text-muted">
										
									</div>
								</div>

								<div class="form-group m-0">
									<button type="submit" class="btn btn-primary btn-block">
										Reset Password
									</button>
								</div>
							</form>
						</div>
					</div>
					<div class="footer">
						Copyright &copy; <?php echo $year; ?> &mdash; Knjigovostveni sistem
					</div>
				</div>
			</div>
		</div>
	</section>

	<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" ></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" ></script>
	<script src="js/login.js"></script>
</body>
</html>
