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
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $link->connect_error]));
}

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and get form data
    $full_name = $link->real_escape_string($_POST['full_name'] ?? '');
    $email = $link->real_escape_string($_POST['email'] ?? '');
    $phone = $link->real_escape_string($_POST['phone'] ?? '');
    $subject = $link->real_escape_string($_POST['subject'] ?? '');
    $message = $link->real_escape_string($_POST['message'] ?? '');

    // Prepare SQL statement
    $sql = "INSERT INTO contact_submissions (
        full_name, email, phone, subject, message
    ) VALUES (?, ?, ?, ?, ?)";

    // Prepare and bind parameters
    $stmt = $link->prepare($sql);
    $stmt->bind_param("sssss", $full_name, $email, $phone, $subject, $message);

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Contact form submitted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error submitting contact form']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$link->close();
?> 