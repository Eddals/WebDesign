<?php
/**
 * Database Configuration for StyleHub E-commerce
 * Created by DevTone Agency
 */

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'stylehub_ecommerce');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Create PDO connection
try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    
} catch (PDOException $e) {
    // Log error and show user-friendly message
    error_log("Database connection failed: " . $e->getMessage());
    die("Sorry, we're experiencing technical difficulties. Please try again later.");
}

// Site configuration
define('SITE_NAME', 'StyleHub');
define('SITE_URL', 'http://localhost/stylehub-ecommerce');
define('SITE_EMAIL', 'info@stylehub.com');

// Upload directories
define('UPLOAD_DIR', 'assets/images/uploads/');
define('PRODUCT_IMAGE_DIR', 'assets/images/products/');
define('CATEGORY_IMAGE_DIR', 'assets/images/categories/');

// Security settings
define('HASH_ALGO', PASSWORD_DEFAULT);
define('SESSION_LIFETIME', 3600); // 1 hour

// Payment settings (for demo purposes)
define('STRIPE_PUBLIC_KEY', 'pk_test_demo_key');
define('STRIPE_SECRET_KEY', 'sk_test_demo_key');
define('PAYPAL_CLIENT_ID', 'demo_paypal_client_id');

// Email settings
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-app-password');

// Pagination settings
define('PRODUCTS_PER_PAGE', 12);
define('REVIEWS_PER_PAGE', 10);

// Currency settings
define('CURRENCY_SYMBOL', '$');
define('CURRENCY_CODE', 'USD');

// Tax settings
define('TAX_RATE', 0.08); // 8% tax rate
define('SHIPPING_COST', 5.99);
define('FREE_SHIPPING_THRESHOLD', 50.00);

// Image settings
define('MAX_IMAGE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_IMAGE_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'webp']);

// Cache settings
define('CACHE_ENABLED', true);
define('CACHE_LIFETIME', 3600); // 1 hour

// Debug mode (set to false in production)
define('DEBUG_MODE', true);

if (DEBUG_MODE) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    error_reporting(0);
}

// Timezone
date_default_timezone_set('America/New_York');

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// CSRF Protection
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

/**
 * Generate CSRF token for forms
 */
function csrf_token() {
    return $_SESSION['csrf_token'];
}

/**
 * Verify CSRF token
 */
function verify_csrf_token($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Sanitize input data
 */
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Validate email address
 */
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Generate secure random string
 */
function generate_random_string($length = 32) {
    return bin2hex(random_bytes($length / 2));
}

/**
 * Format price with currency
 */
function format_price($price) {
    return CURRENCY_SYMBOL . number_format($price, 2);
}

/**
 * Calculate discounted price
 */
function calculate_discount_price($original_price, $discount_percent) {
    return $original_price - ($original_price * ($discount_percent / 100));
}

/**
 * Get file extension
 */
function get_file_extension($filename) {
    return strtolower(pathinfo($filename, PATHINFO_EXTENSION));
}

/**
 * Check if file is valid image
 */
function is_valid_image($file) {
    $extension = get_file_extension($file['name']);
    return in_array($extension, ALLOWED_IMAGE_TYPES) && $file['size'] <= MAX_IMAGE_SIZE;
}

/**
 * Redirect function
 */
function redirect($url) {
    header("Location: " . $url);
    exit();
}

/**
 * Check if user is logged in
 */
function is_logged_in() {
    return isset($_SESSION['user_id']);
}

/**
 * Check if user is admin
 */
function is_admin() {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

/**
 * Get current user ID
 */
function get_current_user_id() {
    return $_SESSION['user_id'] ?? null;
}

/**
 * Log activity
 */
function log_activity($message, $user_id = null) {
    if (!$user_id) {
        $user_id = get_current_user_id();
    }
    
    $log_entry = date('Y-m-d H:i:s') . " - User ID: " . ($user_id ?? 'Guest') . " - " . $message . PHP_EOL;
    file_put_contents('logs/activity.log', $log_entry, FILE_APPEND | LOCK_EX);
}

/**
 * Send email function (basic implementation)
 */
function send_email($to, $subject, $message, $headers = '') {
    if (empty($headers)) {
        $headers = "From: " . SITE_EMAIL . "\r\n";
        $headers .= "Reply-To: " . SITE_EMAIL . "\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    }
    
    return mail($to, $subject, $message, $headers);
}

/**
 * Create thumbnail image
 */
function create_thumbnail($source, $destination, $width = 300, $height = 300) {
    $info = getimagesize($source);
    $mime = $info['mime'];
    
    switch ($mime) {
        case 'image/jpeg':
            $image = imagecreatefromjpeg($source);
            break;
        case 'image/png':
            $image = imagecreatefrompng($source);
            break;
        case 'image/gif':
            $image = imagecreatefromgif($source);
            break;
        default:
            return false;
    }
    
    $thumb = imagecreatetruecolor($width, $height);
    imagecopyresampled($thumb, $image, 0, 0, 0, 0, $width, $height, $info[0], $info[1]);
    
    switch ($mime) {
        case 'image/jpeg':
            imagejpeg($thumb, $destination, 90);
            break;
        case 'image/png':
            imagepng($thumb, $destination);
            break;
        case 'image/gif':
            imagegif($thumb, $destination);
            break;
    }
    
    imagedestroy($image);
    imagedestroy($thumb);
    
    return true;
}

// Initialize error handling
set_error_handler(function($severity, $message, $file, $line) {
    if (!(error_reporting() & $severity)) {
        return false;
    }
    
    $error_message = "Error: $message in $file on line $line";
    error_log($error_message);
    
    if (DEBUG_MODE) {
        echo "<div style='background: #f8d7da; color: #721c24; padding: 10px; margin: 10px; border: 1px solid #f5c6cb; border-radius: 4px;'>";
        echo "<strong>Debug Error:</strong> $error_message";
        echo "</div>";
    }
    
    return true;
});

// DevTone Agency Credits
define('AGENCY_NAME', 'DevTone Agency');
define('AGENCY_URL', 'https://devtone.agency');
define('AGENCY_LOGO', 'https://i.imgur.com/N2muQIS.png');

/**
 * Get agency credits for footer
 */
function get_agency_credits() {
    return [
        'name' => AGENCY_NAME,
        'url' => AGENCY_URL,
        'logo' => AGENCY_LOGO,
        'message' => 'Professional E-commerce Development'
    ];
}
?>
