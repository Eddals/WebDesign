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
    $service_type = $link->real_escape_string($_POST['service_type'] ?? '');
    $project_description = $link->real_escape_string($_POST['project_description'] ?? '');
    $estimated_budget = floatval($_POST['estimated_budget'] ?? 0);
    $preferred_timeline = $link->real_escape_string($_POST['preferred_timeline'] ?? '');
    $property_type = $link->real_escape_string($_POST['property_type'] ?? '');
    $property_size = $link->real_escape_string($_POST['property_size'] ?? '');
    $location = $link->real_escape_string($_POST['location'] ?? '');

    // Prepare SQL statement
    $sql = "INSERT INTO estimate_requests (
        full_name, email, phone, service_type, project_description,
        estimated_budget, preferred_timeline, property_type,
        property_size, location
    ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?
    )";

    // Prepare and bind parameters
    $stmt = $link->prepare($sql);
    $stmt->bind_param(
        "sssssdssss",
        $full_name, $email, $phone, $service_type, $project_description,
        $estimated_budget, $preferred_timeline, $property_type,
        $property_size, $location
    );

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Estimate request submitted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error submitting estimate request']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$link->close();
?> 