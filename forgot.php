<?php
session_start();

if (isset($_SESSION['user_id']))
{
    header("Location: /");
}

require 'database.php';

$message = '';
$success = '';
$msg = '';
$year = date('Y');

if (!empty($_POST['email']))
{

    $records = $conn->prepare('SELECT id,email,password FROM users WHERE email = :email');
    $records->bindParam(':email', $_POST['email']);
    $records->execute();
    $pass = $records->fetch(PDO::FETCH_ASSOC);

    if (is_array($pass))
    {

        $records = $conn->prepare('SELECT id,email,password FROM forgot WHERE email = :email');
        $records->bindParam(':email', $_POST['email']);
        $records->execute();
        $sended = $records->fetch(PDO::FETCH_ASSOC);

        if (is_array($sended))
        {
            $message = 'Reset link alredy sended!';
        }
        else
        {

            $sql = "INSERT INTO forgot (email, password) VALUES (:email, :password)";
            $stmt = $conn->prepare($sql);

            $stmt->bindParam(':email', $_POST['email']);

            $password = $pass['password'];

            $stmt->bindParam(':password', $password);

            if ($stmt->execute()):

                $msg = "<a taret = '_blank' href='./reset.php?key=" . $_POST['email'] . "&amp;token=" . $password . "'>Click To Reset password</a>";
                $msg = wordwrap($msg, 70);
                if (mail($_POST['email'], "Reset password", $msg))
                {
                    $message = 'Successfully sended a password reset link to ' . $_POST['email'];
                    $success = 'true';
                }
                else
                {
                    $message = 'Sorry there must have been an issue creating your account';
                }

                else:
                    $message = 'Sorry there must have been an issue creating your account';
                endif;
            }

        }
        else
        {

            $message = 'Email does not exisits!';
        }
    }

?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="author" content="Kodinger">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<title>Forgot</title>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" >
	<link rel="stylesheet" type="text/css" href="css/login.css">
	<link rel="icon" href="./data/icon.svg">
	
	<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.bundle.min.js"></script>
</head>
<body class="my-login-page">
	<section class="h-100">
		<div class="container h-100">
			<div class="row justify-content-md-center align-items-center h-100">
				<div class="card-wrapper">
					<div class="brand mx-auto my-3">
						<img src="./data/icon.svg" alt="">
					</div>
					<div class="alert alert-<?php echo ($success == '') ? 'warning' : 'success'; ?> alert-dismissible <?php echo ($message == '') ? ' d-none' : ''; ?>">
						<strong><?=$message ?></strong>
						<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
					</div>
					
					<div class="card fat">
						<div class="card-body">
							<h4 class="card-title">Forgot Password</h4>
							<form method="POST" class="my-login-validation" novalidate="">
								<div class="form-group">
									<label for="email">E-Mail Address</label>
									<input id="email" type="email" class="form-control" name="email" value="" required autofocus>
									<div class="invalid-feedback">
										Email is invalid
									</div>
									<div class="form-text text-muted">
										By clicking "Reset Password" we will send a password reset link
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
					<?php //echo $msg; ?>
				</div>
			</div>
		</div>
	</section>


	<script src="js/login.js"></script>
</body>
</html>
