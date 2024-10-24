<?php
session_start();
include 'db.php';

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username AND password = :password");
        $stmt->execute(array(':username' => $username, ':password' => $password));

    
        if ($stmt->rowCount() == 1) {
            $_SESSION['username'] = $username;
            header("Location: index.html");
            exit();
        } else {
            $error = "Invalid username or password.";
        }
    } catch (PDOException $e) {
        $error = "Database error: " . $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <link rel="icon" href="png/logo.png" type="image/x-icon">
    <link rel="stylesheet" href="login.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome back!</h1>
            <h2>We're here for you, now & always!</h2>
        </div>
        <div class="login-section">
            <img src="png/image 1.png" alt="Placeholder Image" />
            <div class="divider"></div>
            <div class="login-form">
                <h3 style="color: #262626; font-size: 40px; font-weight: 500;">Login to your account</h3>
                <form action="" method="POST">
                    <div class="form-field">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" placeholder="Enter your username here" required />
                    </div>
                    
                    <div class="form-field">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Your password" required />
                    </div>
                    <button class="button" type="submit">Login to Your Account</button>
                </form>
                <div class="register-text">
                    <span>Don’t have an account yet? </span>
                    <span class="register-link">Register now!</span>
                </div>
            </div>
        </div>
        <div class="forgot-password">Forgot Password?</div>
    </div>
    <div class="footer">
        <div>Privacy Policy</div>
        <div>©2024 Amanora</div>
    </div>
</body>
</html>
