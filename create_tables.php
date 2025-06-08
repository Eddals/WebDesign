<?php
// Database connection parameters
$host_name = 'db5017917085.hosting-data.io';
$database = 'dbs14264864';
$user_name = 'dbu3857270';
$password = 'Alebaba1!';

// Create connection
$link = new mysqli($host_name, $user_name, $password, $database);

// Check connection
if ($link->connect_error) {
    die('Failed to connect to MySQL: ' . $link->connect_error);
}

echo 'Connected to MySQL server successfully.<br>';

// Read and execute SQL statements
$sql = file_get_contents('create_tables.sql');

if ($link->multi_query($sql)) {
    echo 'Tables created successfully.<br>';
} else {
    echo 'Error creating tables: ' . $link->error . '<br>';
}

$link->close();
?> 