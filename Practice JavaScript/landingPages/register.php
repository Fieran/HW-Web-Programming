<?php
# Set page title and display header section.
$page_title = 'Register' ; #Page title
include ( 'includes/headerout.php' ); #Include the navigation bar at the top of the page 

# Check form submitted.
if ( $_SERVER[ 'REQUEST_METHOD' ] == 'POST' )
{
  # Connect to the database.
  require ('connect_db.php'); 
  
  # Initialize an error array.
  $errors = array();
   
  # Check for a username:
  if ( empty( $_POST[ 'username' ] ) )
  { 
  $errors[] = 'Enter your username.'; #If no username entered, display an error
  }
  else
  { 
  $usrnme = mysqli_real_escape_string( $link, trim( $_POST[ 'username' ] ) ) ; #Else if username entered assign it to $usernme variable
  }
    	  	 
 # Check for a password and matching input passwords.
  if ( !empty($_POST[ 'pass1' ] ) )
  {
    if ( $_POST[ 'pass1' ] != $_POST[ 'pass2' ] )
    { 
		$errors[] = 'Passwords do not match.' ; #Error message if pass1 and pass2 do not match 		
	}
    else
    { 
		$p = mysqli_real_escape_string( $link, trim( $_POST[ 'pass1' ] ) ) ; #If they do assign the password to $p variable
	}
  }
	else 
	{ 
		$errors[] = 'Enter your password.' ; #If no password entered, display an error 
	}
    
  # Check if username already registered.
  if ( empty( $errors ) )
  {
    $q = "SELECT id FROM users WHERE username='$usrnme'" ;
    $r = @mysqli_query ( $link, $q ) ;
    if ( mysqli_num_rows( $r ) != 0 ) $errors[] = 'username already registered. <a href="login.php">Login</a>' ;
  }
    
# On success register user inserting into 'users' database table.
  if ( empty( $errors ) ) 
  {
    $q = "INSERT INTO users (username, pass) VALUES ('$usrnme', SHA1('$p'))";
    $r = @mysqli_query ( $link, $q ) ;
    if ($r)
    { echo '<div class="container"><h1>Registered!</h1><p>You are now registered.</p><p><a href="login.php">Login</a></p>'; }

 # Close database connection.
    mysqli_close($link); 
 exit();
  }
  
  # Or report errors to the user.
  else 
  {
    echo '<div class="container"><h1>Error!</h1><p id="err_msg">The following error(s) occurred:<br>' ;
    foreach ( $errors as $msg ) #Error message 
    { echo " - $msg<br>" ; }
    echo 'Please try again.</p></div>';
	
    # Close database connection.
    mysqli_close( $link );
  }  
}
?>

<!doctype html> <!-- HTML begins -->

<html lang="en"> <!-- Set page language to english -->

	<head> <!-- Head begins -->

	</head> <!-- Head ends -->
	
	<!-- Breadcrumb under navigation bar to inform users what page they are on -->
	<nav aria-label="breadcrumb">
		<ol class="breadcrumb">
			<li class="breadcrumb-item active" aria-current="page">Register</li>
		</ol>
	</nav> 

	<body> <!-- Body begins -->

		<form action="register.php" method="post"> <!-- User registration form begins -->
		
		<div class="container"> <!-- Bootstrap container begins -->
			
		<h1>Create Account</h1>
		
		<!-- Input field for username -->
		<input type="text" 
		class="form-control" 
		placeholder="Username" 
		name="username" 
		required 
		size="20" 
		value="<?php if (isset($_POST['username'])) echo $_POST['username']; ?>">
		<hr>	
		
		<!-- Input field for password 1 -->
		<input type="password" 
		class="form-control" 
		placeholder="Create Password" 
		name="pass1" 
		required size="20" 
		value="<?php if (isset($_POST['pass1'])) echo $_POST['pass1']; ?>" >
		<hr>
	
		<!-- Input field for password 2 -->
		<input type="password" 
		class="form-control" 
		placeholder="Confirm Password" 
		name="pass2" 
		required size="20" 
		value="<?php if (isset($_POST['pass2'])) echo $_POST['pass2']; ?>">
		<hr>	
	
		<!-- Submit button for account registration -->
		<input class="btn btn-primary btn-block" type="submit" value="Create Account">
		<hr>			
		</form> <!-- End of registration form -->
	
		</div> <!-- End of bootstrap container -->

   </body> <!-- End of body -->
</html> <!-- End of HTML -->