-- StyleHub E-commerce Database
-- Created by DevTone Agency
-- MySQL Database Schema

CREATE DATABASE IF NOT EXISTS stylehub_ecommerce;
USE stylehub_ecommerce;

-- Categories Table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(255),
    parent_id INT DEFAULT NULL,
    sort_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Products Table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(5,2) DEFAULT 0,
    stock_quantity INT DEFAULT 0,
    category_id INT,
    image VARCHAR(255),
    gallery TEXT, -- JSON array of images
    weight DECIMAL(8,2),
    dimensions VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE,
    is_digital BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured)
);

-- Product Images Table
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Product Variants Table (for sizes, colors, etc.)
CREATE TABLE product_variants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    type ENUM('size', 'color', 'material', 'style') NOT NULL,
    value VARCHAR(100) NOT NULL,
    price_modifier DECIMAL(10,2) DEFAULT 0,
    stock_quantity INT DEFAULT 0,
    sku VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    role ENUM('customer', 'admin', 'manager') DEFAULT 'customer',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status)
);

-- User Addresses Table
CREATE TABLE user_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('billing', 'shipping') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_transaction_id VARCHAR(255),
    shipping_address TEXT,
    billing_address TEXT,
    notes TEXT,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number)
);

-- Order Items Table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    variant_info TEXT, -- JSON for variant details
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Reviews Table
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_product_review (user_id, product_id)
);

-- Wishlist Table
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Coupons Table
CREATE TABLE coupons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    type ENUM('percentage', 'fixed') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    minimum_amount DECIMAL(10,2) DEFAULT 0,
    maximum_discount DECIMAL(10,2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    starts_at TIMESTAMP,
    expires_at TIMESTAMP,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Newsletter Subscribers Table
CREATE TABLE newsletter_subscribers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    status ENUM('subscribed', 'unsubscribed') DEFAULT 'subscribed',
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL
);

-- Contact Messages Table
CREATE TABLE contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings Table
CREATE TABLE site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('text', 'number', 'boolean', 'json') DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Sample Categories
INSERT INTO categories (name, slug, description, image, sort_order) VALUES
('Men\'s Clothing', 'mens-clothing', 'Stylish clothing for men', 'mens-clothing.jpg', 1),
('Women\'s Clothing', 'womens-clothing', 'Fashion-forward clothing for women', 'womens-clothing.jpg', 2),
('Shoes', 'shoes', 'Comfortable and stylish footwear', 'shoes.jpg', 3),
('Accessories', 'accessories', 'Complete your look with our accessories', 'accessories.jpg', 4),
('Sale', 'sale', 'Great deals and discounts', 'sale.jpg', 5);

-- Insert Sample Products
INSERT INTO products (name, slug, description, short_description, sku, price, discount, stock_quantity, category_id, image, is_featured) VALUES
('Classic White T-Shirt', 'classic-white-tshirt', 'Premium cotton t-shirt perfect for everyday wear. Comfortable fit and durable material.', 'Premium cotton t-shirt for everyday wear', 'TSH-001', 29.99, 0, 100, 1, 'tshirt-white.jpg', TRUE),
('Denim Jeans', 'denim-jeans', 'High-quality denim jeans with perfect fit and comfort. Available in multiple sizes.', 'High-quality denim jeans with perfect fit', 'JNS-001', 79.99, 15, 50, 1, 'jeans-blue.jpg', TRUE),
('Summer Dress', 'summer-dress', 'Beautiful floral summer dress perfect for warm weather. Light and comfortable fabric.', 'Beautiful floral summer dress', 'DRS-001', 59.99, 20, 30, 2, 'dress-floral.jpg', TRUE),
('Running Shoes', 'running-shoes', 'Professional running shoes with excellent cushioning and support for all terrains.', 'Professional running shoes with excellent support', 'SHO-001', 129.99, 10, 25, 3, 'shoes-running.jpg', TRUE),
('Leather Wallet', 'leather-wallet', 'Genuine leather wallet with multiple card slots and bill compartments.', 'Genuine leather wallet with multiple slots', 'WAL-001', 49.99, 0, 75, 4, 'wallet-leather.jpg', FALSE),
('Casual Blazer', 'casual-blazer', 'Stylish casual blazer perfect for business casual or smart casual occasions.', 'Stylish casual blazer for any occasion', 'BLZ-001', 149.99, 25, 20, 1, 'blazer-navy.jpg', TRUE),
('Silk Scarf', 'silk-scarf', 'Luxurious silk scarf with beautiful patterns. Perfect accessory for any outfit.', 'Luxurious silk scarf with beautiful patterns', 'SCF-001', 39.99, 0, 40, 4, 'scarf-silk.jpg', FALSE),
('Sneakers', 'casual-sneakers', 'Comfortable casual sneakers perfect for everyday wear. Stylish and durable.', 'Comfortable casual sneakers for everyday wear', 'SNK-001', 89.99, 0, 60, 3, 'sneakers-white.jpg', TRUE);

-- Insert Sample Users (Admin and Test Customer)
INSERT INTO users (first_name, last_name, email, password, role, status, email_verified) VALUES
('Admin', 'User', 'admin@stylehub.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active', TRUE),
('John', 'Doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'active', TRUE),
('Jane', 'Smith', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'active', TRUE);

-- Insert Sample Reviews
INSERT INTO reviews (product_id, user_id, rating, title, comment, status) VALUES
(1, 2, 5, 'Great Quality!', 'Love this t-shirt! Perfect fit and great material.', 'approved'),
(1, 3, 4, 'Good value', 'Nice t-shirt for the price. Would recommend.', 'approved'),
(2, 2, 5, 'Perfect Jeans', 'These jeans fit perfectly and are very comfortable.', 'approved'),
(3, 3, 5, 'Beautiful Dress', 'Absolutely love this dress! Perfect for summer.', 'approved'),
(4, 2, 4, 'Comfortable Shoes', 'Great running shoes, very comfortable for long runs.', 'approved');

-- Insert Sample Site Settings
INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES
('site_name', 'StyleHub', 'text'),
('site_description', 'Premium Fashion Store', 'text'),
('currency', 'USD', 'text'),
('tax_rate', '0.08', 'number'),
('shipping_cost', '5.99', 'number'),
('free_shipping_threshold', '50.00', 'number'),
('contact_email', 'info@stylehub.com', 'text'),
('contact_phone', '+1 (555) 123-4567', 'text'),
('social_facebook', 'https://facebook.com/stylehub', 'text'),
('social_instagram', 'https://instagram.com/stylehub', 'text'),
('social_twitter', 'https://twitter.com/stylehub', 'text');

-- Create Indexes for Better Performance
CREATE INDEX idx_products_category_status ON products(category_id, status);
CREATE INDEX idx_products_featured ON products(is_featured, status);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_reviews_product_status ON reviews(product_id, status);
CREATE INDEX idx_wishlist_user ON wishlist(user_id);

-- DevTone Agency Credits
INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES
('developer_name', 'DevTone Agency', 'text'),
('developer_url', 'https://devtone.agency', 'text'),
('developer_logo', 'https://i.imgur.com/N2muQIS.png', 'text'),
('development_year', '2024', 'text');

-- Sample Product Variants
INSERT INTO product_variants (product_id, type, value, stock_quantity) VALUES
(1, 'size', 'S', 25),
(1, 'size', 'M', 30),
(1, 'size', 'L', 25),
(1, 'size', 'XL', 20),
(2, 'size', '30', 10),
(2, 'size', '32', 15),
(2, 'size', '34', 15),
(2, 'size', '36', 10),
(3, 'size', 'XS', 5),
(3, 'size', 'S', 10),
(3, 'size', 'M', 10),
(3, 'size', 'L', 5),
(4, 'size', '8', 5),
(4, 'size', '9', 8),
(4, 'size', '10', 7),
(4, 'size', '11', 5);

-- Sample Coupons
INSERT INTO coupons (code, type, value, minimum_amount, usage_limit, starts_at, expires_at) VALUES
('WELCOME10', 'percentage', 10.00, 50.00, 100, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('SAVE20', 'fixed', 20.00, 100.00, 50, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY)),
('SUMMER25', 'percentage', 25.00, 75.00, 200, NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY));

-- Create Views for Common Queries
CREATE VIEW featured_products_view AS
SELECT 
    p.*,
    c.name as category_name,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as review_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN reviews r ON p.id = r.product_id AND r.status = 'approved'
WHERE p.is_featured = TRUE AND p.status = 'active'
GROUP BY p.id;

CREATE VIEW product_stats_view AS
SELECT 
    p.*,
    c.name as category_name,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as review_count,
    COALESCE(SUM(oi.quantity), 0) as total_sold
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN reviews r ON p.id = r.product_id AND r.status = 'approved'
LEFT JOIN order_items oi ON p.id = oi.product_id
WHERE p.status = 'active'
GROUP BY p.id;
