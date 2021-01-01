<?php
session_start();

if (isset($_SESSION['user_id']))
{
    header("Location: /");
}

require 'database.php';

$message = '';
$success = '';
$year = date('Y');

if (!empty($_POST['email']) && !empty($_POST['password']))
{

    $records = $conn->prepare('SELECT id,email,password FROM users WHERE email = :email');
    $records->bindParam(':email', $_POST['email']);
    $records->execute();
    $results = $records->fetch(PDO::FETCH_ASSOC);

    if (is_array($results))
    {
        $message = 'User with this email already exists!';
    }
    else
    {

        // Enter the new user in the database
        $sql = "INSERT INTO users (email, password) VALUES (:email, :password)";
        $stmt = $conn->prepare($sql);

        $stmt->bindParam(':email', $_POST['email']);

        $stmt->bindParam(':password', password_hash($_POST['password'], PASSWORD_BCRYPT));

        if ($stmt->execute()):
            $message = 'Successfully created new user';
            $success = 'success';
        else:
            $message = 'Sorry there must have been an issue creating your account';
        endif;
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="author" content="Kodinger">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<title>Register</title>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
	<link rel="stylesheet" type="text/css" href="css/login.css">
	<link rel="icon" href="./data/icon.svg">
</head>
<body class="my-login-page">
	<section class="h-100">
		<div class="container h-100">
			<div class="row justify-content-md-center h-100">
				<div class="card-wrapper">
					<div class="brand mx-auto my-3">
						<img src="./data/icon.svg" alt="">
					</div>
					
					<div class="alert alert-<?php echo ($success == '') ? 'warning' : 'success'; ?> alert-dismissible<?php echo ($message == '') ? ' d-none' : ''; ?>">
						<strong><?=$message ?></strong>
						<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
					</div>
					
					
					<div class="card fat">
						<div class="card-body">
							<h4 class="card-title">Register</h4>
							<form method="POST" class="my-login-validation" novalidate="">

								<div class="form-group">
									<label for="email">E-Mail Address</label>
									<input id="email" type="email" class="form-control" name="email" required>
									<div class="invalid-feedback">
										Your email is invalid
									</div>
								</div>

								<div class="form-group">
									<label for="password">Password</label>
									<input  id="password" type="password" class="form-control" name="password" required data-register>
									<div class="invalid-feedback">Password is required</div>
									<div id = 'strength' ></div>
								</div>
								
								<div class="form-group">
									<label for="confirm_password">Confirm password</label>
									<input id="confirm_password" type="password" class="form-control" name="confirm_password" required data-register>
									<div id = 'message' ></div>
								</div>

								<div class="form-group">
									<div class="custom-checkbox custom-control">
										<input type="checkbox" name="agree" id="agree" class="custom-control-input" required="">
										<label for="agree" class="custom-control-label">I agree to the <a href="#">Terms and Conditions</a></label>
										<div class="invalid-feedback">
											You must agree with our Terms and Conditions
										</div>
									</div>
								</div>

								<div class="form-group m-0">
									<button type="submit" class="btn btn-primary btn-block">
										Register
									</button>
								</div>
								<div class="mt-4 text-center">
									Already have an account? <a href="login.php">Login</a>
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

	<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
	<script src="js/login.js"></script>
</body>
</html>
