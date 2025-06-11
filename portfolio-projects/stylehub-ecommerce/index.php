<?php
session_start();
require_once 'config/database.php';
require_once 'includes/functions.php';

// Get featured products
$featured_products = getFeaturedProducts($pdo);
$categories = getCategories($pdo);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StyleHub - Premium Fashion Store</title>
    <meta name="description" content="Discover the latest fashion trends at StyleHub. Premium clothing, shoes, and accessories for men and women.">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <!-- Logo -->
                <div class="logo">
                    <h1><i class="fas fa-shopping-bag"></i> StyleHub</h1>
                </div>

                <!-- Navigation -->
                <nav class="nav">
                    <ul class="nav-links">
                        <li><a href="#home" class="nav-link active">Home</a></li>
                        <li class="dropdown">
                            <a href="#" class="nav-link">Categories <i class="fas fa-chevron-down"></i></a>
                            <div class="dropdown-menu">
                                <?php foreach ($categories as $category): ?>
                                    <a href="category.php?id=<?= $category['id'] ?>"><?= htmlspecialchars($category['name']) ?></a>
                                <?php endforeach; ?>
                            </div>
                        </li>
                        <li><a href="products.php" class="nav-link">Products</a></li>
                        <li><a href="about.php" class="nav-link">About</a></li>
                        <li><a href="contact.php" class="nav-link">Contact</a></li>
                    </ul>
                </nav>

                <!-- Header Actions -->
                <div class="header-actions">
                    <div class="search-box">
                        <input type="text" placeholder="Search products..." id="searchInput">
                        <button type="button"><i class="fas fa-search"></i></button>
                    </div>
                    
                    <div class="user-menu">
                        <?php if (isset($_SESSION['user_id'])): ?>
                            <a href="account.php" class="user-link">
                                <i class="fas fa-user"></i>
                                <span>Account</span>
                            </a>
                        <?php else: ?>
                            <a href="login.php" class="user-link">
                                <i class="fas fa-sign-in-alt"></i>
                                <span>Login</span>
                            </a>
                        <?php endif; ?>
                    </div>

                    <div class="cart-icon">
                        <a href="cart.php">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="cart-count" id="cartCount"><?= getCartCount() ?></span>
                        </a>
                    </div>

                    <button class="mobile-menu-btn" id="mobileMenuBtn">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="hero-slider">
            <div class="hero-slide active">
                <div class="hero-content">
                    <div class="container">
                        <div class="hero-text">
                            <h2 class="hero-title">Summer Collection 2024</h2>
                            <p class="hero-subtitle">Discover the latest trends in fashion with our premium summer collection</p>
                            <div class="hero-buttons">
                                <a href="products.php" class="btn btn-primary">Shop Now</a>
                                <a href="#featured" class="btn btn-outline">View Collection</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="hero-image">
                    <img src="assets/images/hero-1.jpg" alt="Summer Collection">
                </div>
            </div>

            <div class="hero-slide">
                <div class="hero-content">
                    <div class="container">
                        <div class="hero-text">
                            <h2 class="hero-title">Premium Quality</h2>
                            <p class="hero-subtitle">Experience luxury fashion with our carefully curated premium collection</p>
                            <div class="hero-buttons">
                                <a href="products.php?category=premium" class="btn btn-primary">Explore Premium</a>
                                <a href="#about" class="btn btn-outline">Learn More</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="hero-image">
                    <img src="assets/images/hero-2.jpg" alt="Premium Collection">
                </div>
            </div>
        </div>

        <!-- Hero Navigation -->
        <div class="hero-nav">
            <button class="hero-nav-btn active" data-slide="0"></button>
            <button class="hero-nav-btn" data-slide="1"></button>
        </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Shop by Category</h2>
                <p class="section-subtitle">Find exactly what you're looking for</p>
            </div>

            <div class="categories-grid">
                <?php foreach ($categories as $category): ?>
                    <div class="category-card">
                        <div class="category-image">
                            <img src="assets/images/categories/<?= $category['image'] ?>" alt="<?= htmlspecialchars($category['name']) ?>">
                            <div class="category-overlay">
                                <a href="category.php?id=<?= $category['id'] ?>" class="category-link">
                                    <span>Shop <?= htmlspecialchars($category['name']) ?></span>
                                    <i class="fas fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                        <div class="category-info">
                            <h3><?= htmlspecialchars($category['name']) ?></h3>
                            <p><?= $category['product_count'] ?> Products</p>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Featured Products -->
    <section class="featured-products" id="featured">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Featured Products</h2>
                <p class="section-subtitle">Handpicked items just for you</p>
            </div>

            <div class="products-grid">
                <?php foreach ($featured_products as $product): ?>
                    <div class="product-card" data-aos="fade-up">
                        <div class="product-image">
                            <img src="assets/images/products/<?= $product['image'] ?>" alt="<?= htmlspecialchars($product['name']) ?>">
                            
                            <?php if ($product['discount'] > 0): ?>
                                <div class="product-badge sale">-<?= $product['discount'] ?>%</div>
                            <?php endif; ?>
                            
                            <?php if ($product['is_new']): ?>
                                <div class="product-badge new">New</div>
                            <?php endif; ?>

                            <div class="product-actions">
                                <button class="action-btn" onclick="addToWishlist(<?= $product['id'] ?>)">
                                    <i class="fas fa-heart"></i>
                                </button>
                                <button class="action-btn" onclick="quickView(<?= $product['id'] ?>)">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="action-btn" onclick="addToCart(<?= $product['id'] ?>)">
                                    <i class="fas fa-shopping-cart"></i>
                                </button>
                            </div>
                        </div>

                        <div class="product-info">
                            <div class="product-category"><?= htmlspecialchars($product['category_name']) ?></div>
                            <h3 class="product-name">
                                <a href="product.php?id=<?= $product['id'] ?>"><?= htmlspecialchars($product['name']) ?></a>
                            </h3>
                            
                            <div class="product-rating">
                                <?php for ($i = 1; $i <= 5; $i++): ?>
                                    <i class="fas fa-star <?= $i <= $product['rating'] ? 'active' : '' ?>"></i>
                                <?php endfor; ?>
                                <span class="rating-count">(<?= $product['review_count'] ?>)</span>
                            </div>

                            <div class="product-price">
                                <?php if ($product['discount'] > 0): ?>
                                    <span class="price-original">$<?= number_format($product['original_price'], 2) ?></span>
                                    <span class="price-current">$<?= number_format($product['price'], 2) ?></span>
                                <?php else: ?>
                                    <span class="price-current">$<?= number_format($product['price'], 2) ?></span>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="section-footer">
                <a href="products.php" class="btn btn-outline">View All Products</a>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
        <div class="container">
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-shipping-fast"></i>
                    </div>
                    <div class="feature-content">
                        <h3>Free Shipping</h3>
                        <p>Free shipping on orders over $50</p>
                    </div>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-undo"></i>
                    </div>
                    <div class="feature-content">
                        <h3>Easy Returns</h3>
                        <p>30-day return policy</p>
                    </div>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <div class="feature-content">
                        <h3>Secure Payment</h3>
                        <p>100% secure transactions</p>
                    </div>
                </div>

                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-headset"></i>
                    </div>
                    <div class="feature-content">
                        <h3>24/7 Support</h3>
                        <p>Customer support anytime</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter-section">
        <div class="container">
            <div class="newsletter-content">
                <div class="newsletter-text">
                    <h2>Stay Updated</h2>
                    <p>Subscribe to our newsletter and get 10% off your first order</p>
                </div>
                <form class="newsletter-form" id="newsletterForm">
                    <input type="email" placeholder="Enter your email" required>
                    <button type="submit" class="btn btn-primary">Subscribe</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <div class="footer-logo">
                        <h3><i class="fas fa-shopping-bag"></i> StyleHub</h3>
                        <p>Your premium fashion destination. Discover the latest trends and timeless classics.</p>
                    </div>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-facebook"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>

                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="products.php">All Products</a></li>
                        <li><a href="categories.php">Categories</a></li>
                        <li><a href="sale.php">Sale</a></li>
                        <li><a href="new-arrivals.php">New Arrivals</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h4>Customer Service</h4>
                    <ul>
                        <li><a href="contact.php">Contact Us</a></li>
                        <li><a href="shipping.php">Shipping Info</a></li>
                        <li><a href="returns.php">Returns</a></li>
                        <li><a href="size-guide.php">Size Guide</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h4>Account</h4>
                    <ul>
                        <li><a href="login.php">Login</a></li>
                        <li><a href="register.php">Register</a></li>
                        <li><a href="account.php">My Account</a></li>
                        <li><a href="wishlist.php">Wishlist</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <div class="footer-credits">
                    <p>&copy; 2024 StyleHub. All rights reserved.</p>
                    <div class="portfolio-credit">
                        <span>Developed by <strong>DevTone Agency</strong></span>
                        <a href="https://devtone.agency" target="_blank" class="agency-link">
                            <img src="https://i.imgur.com/N2muQIS.png" alt="DevTone Logo" class="agency-logo">
                            Visit Our Portfolio
                        </a>
                    </div>
                </div>
                <div class="payment-methods">
                    <i class="fab fa-cc-visa"></i>
                    <i class="fab fa-cc-mastercard"></i>
                    <i class="fab fa-cc-paypal"></i>
                    <i class="fab fa-cc-stripe"></i>
                </div>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="assets/js/main.js"></script>
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init({
            duration: 800,
            once: true
        });
    </script>
</body>
</html>
