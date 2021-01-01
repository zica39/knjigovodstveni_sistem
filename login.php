<?php
session_start();

if (isset($_SESSION['user_id']))
{
    header("Location: /");
}

require 'database.php';

$year = date('Y');

if (!empty($_POST['email']) && !empty($_POST['password'])):

    $records = $conn->prepare('SELECT id,email,password FROM users WHERE email = :email');
    $records->bindParam(':email', $_POST['email']);
    $records->execute();
    $results = $records->fetch(PDO::FETCH_ASSOC);

    $message = '';

    if (is_array($results) && password_verify($_POST['password'], $results['password']))
    {

        $_SESSION['user_id'] = $results['id'];

        //Ako je zaboravio password pa se setio
        $sql = "DELETE FROM forgot WHERE email=:email";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':email', $_POST['email']);
        $stmt->execute();

        header("Location: /");

    }
    else
    {
        $message = 'Sorry, those credentials do not match';
    }

endif;

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="author" content="Kodinger">
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<title>Login</title>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" >
	<link rel="stylesheet" type="text/css" href="css/login.css">
	<link rel="icon" href="./data/icon.svg">

</head>

<body class="my-login-page">
	<section class="h-100">
		<div class="container h-100">
			<div class="row justify-content-md-center h-100">
				<div class="card-wrapper">
					<div class="brand mx-auto my-3">
						<img src="./data/icon.svg" alt="logo">
					</div>
					
					<div class="alert alert-warning alert-dismissible<?php echo ($message == '') ? ' d-none' : ''; ?>">
						<strong><?=$message ?></strong>
						<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
					</div>
					
					<div class="card fat">
						<div class="card-body">
							<h4 class="card-title">Login</h4>
							<form action="login.php" method="POST" class="my-login-validation" novalidate="">
								<div class="form-group">
									<label for="email">E-Mail Address</label>
									<input id="email" type="email" class="form-control" name="email" value="" required autofocus>
									<div class="invalid-feedback">
										Email is invalid
									</div>
								</div>

								<div class="form-group">
									<label for="password">Password
										<a href="forgot.php" class="float-right">
											Forgot Password?
										</a>
									</label>
									<input id="password" type="password" class="form-control" name="password" required data-eye>
								    <div class="invalid-feedback">
								    	Password is required
							    	</div>
								</div>

								<div class="form-group">
									<div class="custom-checkbox custom-control">
										<input type="checkbox" name="remember" id="remember" class="custom-control-input">
										<label for="remember" class="custom-control-label">Remember Me</label>
									</div>
								</div>

								<div class="form-group m-0">
									<button type="submit" class="btn btn-primary btn-block">
										Login
									</button>
								</div>
								<div class="mt-4 text-center">
									Don't have an account? <a href="register.php">Create One</a>
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
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
	<script src="js/login.js"></script>
	<script>
	
            $(function() {
 
                if (localStorage.chkbx && localStorage.chkbx != '') {
                    $('#remember').attr('checked', 'checked');
                    $('#email').val(localStorage.usrname);
                    $('#password').val(localStorage.pass);
                } else {
                    $('#remember').removeAttr('checked');
                    $('#email').val('');
                    $('#password').val('');
                }
 
                $('#remember').click(function() {
 
                    if ($('#remember').is(':checked')) {
                        // save username and password
                        localStorage.usrname = $('#email').val();
                        localStorage.pass = $('#password').val();
                        localStorage.chkbx = $('#remember').val();
                    } else {
                        localStorage.usrname = '';
                        localStorage.pass = '';
                        localStorage.chkbx = '';
                    }
                });
            });
 
       
	</script>
</body>
</html>
