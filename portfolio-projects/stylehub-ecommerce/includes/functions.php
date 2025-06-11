<?php
/**
 * Main Functions for StyleHub E-commerce
 * Created by DevTone Agency
 */

/**
 * Get featured products
 */
function getFeaturedProducts($pdo, $limit = 8) {
    $sql = "SELECT p.*, c.name as category_name, 
                   COALESCE(AVG(r.rating), 0) as rating,
                   COUNT(r.id) as review_count,
                   CASE WHEN p.discount > 0 THEN 
                        p.price - (p.price * p.discount / 100) 
                        ELSE p.price END as final_price
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            LEFT JOIN reviews r ON p.id = r.product_id
            WHERE p.is_featured = 1 AND p.status = 'active'
            GROUP BY p.id
            ORDER BY p.created_at DESC 
            LIMIT :limit";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    
    $products = $stmt->fetchAll();
    
    // Add additional product data
    foreach ($products as &$product) {
        $product['original_price'] = $product['price'];
        if ($product['discount'] > 0) {
            $product['price'] = calculate_discount_price($product['price'], $product['discount']);
        }
        $product['is_new'] = (strtotime($product['created_at']) > strtotime('-30 days'));
    }
    
    return $products;
}

/**
 * Get all categories
 */
function getCategories($pdo) {
    $sql = "SELECT c.*, COUNT(p.id) as product_count 
            FROM categories c 
            LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
            WHERE c.status = 'active'
            GROUP BY c.id 
            ORDER BY c.sort_order, c.name";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    return $stmt->fetchAll();
}

/**
 * Get products by category
 */
function getProductsByCategory($pdo, $category_id, $page = 1, $limit = 12) {
    $offset = ($page - 1) * $limit;
    
    $sql = "SELECT p.*, c.name as category_name,
                   COALESCE(AVG(r.rating), 0) as rating,
                   COUNT(r.id) as review_count
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            LEFT JOIN reviews r ON p.id = r.product_id
            WHERE p.category_id = :category_id AND p.status = 'active'
            GROUP BY p.id
            ORDER BY p.created_at DESC 
            LIMIT :limit OFFSET :offset";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':category_id', $category_id, PDO::PARAM_INT);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    return $stmt->fetchAll();
}

/**
 * Get single product by ID
 */
function getProduct($pdo, $product_id) {
    $sql = "SELECT p.*, c.name as category_name,
                   COALESCE(AVG(r.rating), 0) as rating,
                   COUNT(r.id) as review_count
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            LEFT JOIN reviews r ON p.id = r.product_id
            WHERE p.id = :product_id AND p.status = 'active'
            GROUP BY p.id";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
    $stmt->execute();
    
    $product = $stmt->fetch();
    
    if ($product) {
        $product['original_price'] = $product['price'];
        if ($product['discount'] > 0) {
            $product['price'] = calculate_discount_price($product['price'], $product['discount']);
        }
        $product['is_new'] = (strtotime($product['created_at']) > strtotime('-30 days'));
        
        // Get product images
        $product['images'] = getProductImages($pdo, $product_id);
        
        // Get product variants (sizes, colors)
        $product['variants'] = getProductVariants($pdo, $product_id);
    }
    
    return $product;
}

/**
 * Get product images
 */
function getProductImages($pdo, $product_id) {
    $sql = "SELECT * FROM product_images 
            WHERE product_id = :product_id 
            ORDER BY sort_order, id";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
    $stmt->execute();
    
    return $stmt->fetchAll();
}

/**
 * Get product variants
 */
function getProductVariants($pdo, $product_id) {
    $sql = "SELECT * FROM product_variants 
            WHERE product_id = :product_id AND status = 'active'
            ORDER BY type, value";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
    $stmt->execute();
    
    $variants = $stmt->fetchAll();
    $grouped_variants = [];
    
    foreach ($variants as $variant) {
        $grouped_variants[$variant['type']][] = $variant;
    }
    
    return $grouped_variants;
}

/**
 * Search products
 */
function searchProducts($pdo, $query, $page = 1, $limit = 12) {
    $offset = ($page - 1) * $limit;
    $search_term = '%' . $query . '%';
    
    $sql = "SELECT p.*, c.name as category_name,
                   COALESCE(AVG(r.rating), 0) as rating,
                   COUNT(r.id) as review_count
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            LEFT JOIN reviews r ON p.id = r.product_id
            WHERE (p.name LIKE :search OR p.description LIKE :search OR c.name LIKE :search)
            AND p.status = 'active'
            GROUP BY p.id
            ORDER BY p.name
            LIMIT :limit OFFSET :offset";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':search', $search_term);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    return $stmt->fetchAll();
}

/**
 * Get cart count
 */
function getCartCount() {
    if (!isset($_SESSION['cart'])) {
        return 0;
    }
    
    $count = 0;
    foreach ($_SESSION['cart'] as $item) {
        $count += $item['quantity'];
    }
    
    return $count;
}

/**
 * Add item to cart
 */
function addToCart($product_id, $quantity = 1, $variant_id = null) {
    if (!isset($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
    }
    
    $cart_key = $product_id . '_' . ($variant_id ?? 'default');
    
    if (isset($_SESSION['cart'][$cart_key])) {
        $_SESSION['cart'][$cart_key]['quantity'] += $quantity;
    } else {
        $_SESSION['cart'][$cart_key] = [
            'product_id' => $product_id,
            'variant_id' => $variant_id,
            'quantity' => $quantity,
            'added_at' => time()
        ];
    }
    
    return true;
}

/**
 * Remove item from cart
 */
function removeFromCart($cart_key) {
    if (isset($_SESSION['cart'][$cart_key])) {
        unset($_SESSION['cart'][$cart_key]);
        return true;
    }
    return false;
}

/**
 * Update cart item quantity
 */
function updateCartQuantity($cart_key, $quantity) {
    if (isset($_SESSION['cart'][$cart_key])) {
        if ($quantity <= 0) {
            unset($_SESSION['cart'][$cart_key]);
        } else {
            $_SESSION['cart'][$cart_key]['quantity'] = $quantity;
        }
        return true;
    }
    return false;
}

/**
 * Get cart items with product details
 */
function getCartItems($pdo) {
    if (!isset($_SESSION['cart']) || empty($_SESSION['cart'])) {
        return [];
    }
    
    $cart_items = [];
    
    foreach ($_SESSION['cart'] as $cart_key => $item) {
        $product = getProduct($pdo, $item['product_id']);
        
        if ($product) {
            $cart_item = [
                'cart_key' => $cart_key,
                'product' => $product,
                'quantity' => $item['quantity'],
                'variant_id' => $item['variant_id'],
                'subtotal' => $product['price'] * $item['quantity']
            ];
            
            // Get variant details if applicable
            if ($item['variant_id']) {
                $cart_item['variant'] = getVariantById($pdo, $item['variant_id']);
            }
            
            $cart_items[] = $cart_item;
        }
    }
    
    return $cart_items;
}

/**
 * Get variant by ID
 */
function getVariantById($pdo, $variant_id) {
    $sql = "SELECT * FROM product_variants WHERE id = :variant_id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':variant_id', $variant_id, PDO::PARAM_INT);
    $stmt->execute();
    
    return $stmt->fetch();
}

/**
 * Calculate cart total
 */
function calculateCartTotal($cart_items) {
    $subtotal = 0;
    
    foreach ($cart_items as $item) {
        $subtotal += $item['subtotal'];
    }
    
    $tax = $subtotal * TAX_RATE;
    $shipping = ($subtotal >= FREE_SHIPPING_THRESHOLD) ? 0 : SHIPPING_COST;
    $total = $subtotal + $tax + $shipping;
    
    return [
        'subtotal' => $subtotal,
        'tax' => $tax,
        'shipping' => $shipping,
        'total' => $total
    ];
}

/**
 * Get user by email
 */
function getUserByEmail($pdo, $email) {
    $sql = "SELECT * FROM users WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    return $stmt->fetch();
}

/**
 * Create new user
 */
function createUser($pdo, $data) {
    $sql = "INSERT INTO users (first_name, last_name, email, password, phone, created_at) 
            VALUES (:first_name, :last_name, :email, :password, :phone, NOW())";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':first_name', $data['first_name']);
    $stmt->bindParam(':last_name', $data['last_name']);
    $stmt->bindParam(':email', $data['email']);
    $stmt->bindParam(':password', password_hash($data['password'], HASH_ALGO));
    $stmt->bindParam(':phone', $data['phone']);
    
    return $stmt->execute();
}

/**
 * Verify user login
 */
function verifyLogin($pdo, $email, $password) {
    $user = getUserByEmail($pdo, $email);
    
    if ($user && password_verify($password, $user['password'])) {
        // Update last login
        $sql = "UPDATE users SET last_login = NOW() WHERE id = :user_id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':user_id', $user['id']);
        $stmt->execute();
        
        return $user;
    }
    
    return false;
}

/**
 * Get recent orders for user
 */
function getUserOrders($pdo, $user_id, $limit = 10) {
    $sql = "SELECT o.*, COUNT(oi.id) as item_count
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = :user_id
            GROUP BY o.id
            ORDER BY o.created_at DESC
            LIMIT :limit";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    
    return $stmt->fetchAll();
}

/**
 * Get product reviews
 */
function getProductReviews($pdo, $product_id, $limit = 10) {
    $sql = "SELECT r.*, u.first_name, u.last_name
            FROM reviews r
            LEFT JOIN users u ON r.user_id = u.id
            WHERE r.product_id = :product_id AND r.status = 'approved'
            ORDER BY r.created_at DESC
            LIMIT :limit";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    
    return $stmt->fetchAll();
}

/**
 * Add product review
 */
function addProductReview($pdo, $data) {
    $sql = "INSERT INTO reviews (product_id, user_id, rating, title, comment, created_at) 
            VALUES (:product_id, :user_id, :rating, :title, :comment, NOW())";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':product_id', $data['product_id']);
    $stmt->bindParam(':user_id', $data['user_id']);
    $stmt->bindParam(':rating', $data['rating']);
    $stmt->bindParam(':title', $data['title']);
    $stmt->bindParam(':comment', $data['comment']);
    
    return $stmt->execute();
}

/**
 * Get wishlist items for user
 */
function getWishlistItems($pdo, $user_id) {
    $sql = "SELECT w.*, p.name, p.price, p.image, p.discount
            FROM wishlist w
            LEFT JOIN products p ON w.product_id = p.id
            WHERE w.user_id = :user_id AND p.status = 'active'
            ORDER BY w.created_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    
    return $stmt->fetchAll();
}

/**
 * Add to wishlist
 */
function addToWishlist($pdo, $user_id, $product_id) {
    // Check if already in wishlist
    $sql = "SELECT id FROM wishlist WHERE user_id = :user_id AND product_id = :product_id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':product_id', $product_id);
    $stmt->execute();
    
    if ($stmt->fetch()) {
        return false; // Already in wishlist
    }
    
    // Add to wishlist
    $sql = "INSERT INTO wishlist (user_id, product_id, created_at) VALUES (:user_id, :product_id, NOW())";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':product_id', $product_id);
    
    return $stmt->execute();
}

/**
 * Remove from wishlist
 */
function removeFromWishlist($pdo, $user_id, $product_id) {
    $sql = "DELETE FROM wishlist WHERE user_id = :user_id AND product_id = :product_id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':product_id', $product_id);

    return $stmt->execute();
}

/**
 * Get related products
 */
function getRelatedProducts($pdo, $product_id, $category_id, $limit = 4) {
    $sql = "SELECT p.*, c.name as category_name,
                   COALESCE(AVG(r.rating), 0) as rating,
                   COUNT(r.id) as review_count
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN reviews r ON p.id = r.product_id
            WHERE p.category_id = :category_id
            AND p.id != :product_id
            AND p.status = 'active'
            GROUP BY p.id
            ORDER BY RAND()
            LIMIT :limit";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':category_id', $category_id, PDO::PARAM_INT);
    $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll();
}

/**
 * Create order
 */
function createOrder($pdo, $order_data, $cart_items) {
    try {
        $pdo->beginTransaction();

        // Insert order
        $sql = "INSERT INTO orders (user_id, order_number, total_amount, status,
                                   shipping_address, billing_address, payment_method, created_at)
                VALUES (:user_id, :order_number, :total_amount, :status,
                        :shipping_address, :billing_address, :payment_method, NOW())";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($order_data);

        $order_id = $pdo->lastInsertId();

        // Insert order items
        foreach ($cart_items as $item) {
            $sql = "INSERT INTO order_items (order_id, product_id, quantity, price, total)
                    VALUES (:order_id, :product_id, :quantity, :price, :total)";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'order_id' => $order_id,
                'product_id' => $item['product']['id'],
                'quantity' => $item['quantity'],
                'price' => $item['product']['price'],
                'total' => $item['subtotal']
            ]);
        }

        $pdo->commit();

        // Clear cart
        unset($_SESSION['cart']);

        return $order_id;

    } catch (Exception $e) {
        $pdo->rollBack();
        return false;
    }
}

/**
 * Generate order number
 */
function generateOrderNumber() {
    return 'SH' . date('Y') . str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
}
?>
