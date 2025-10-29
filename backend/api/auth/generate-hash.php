<?php
//password hash generator q to bro 
$password = '123';

$hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);

echo "<h1>New Password Hash:</h1>";
echo "<p>Password: " . htmlspecialchars($password) . "</p>";
echo "<p><strong>Copy this hash:</strong></p>";
echo '<textarea rows="3" cols="80" readonly>' . htmlspecialchars($hash) . '</textarea>';

?>