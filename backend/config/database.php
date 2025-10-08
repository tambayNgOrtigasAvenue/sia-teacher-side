<?php
    $config = array(
        'host' => 'localhost',
        'db_name' => 'db_sms_t',
        'username' => 'root',
        'password' => '',

        try{
            $connection = new PDO("mysql:host=" . $config['host'] . ";dbname=" . $config['db_name'], $config['username'], $config['password']);
            $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        catch(PDOException $e){
            die("Connection error: " . $e->getMessage());
        }
    )