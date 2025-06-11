# StyleHub E-commerce Platform

**Professional E-commerce Website**  
*Developed by DevTone Agency*

## 🛍️ About StyleHub

StyleHub is a modern, responsive e-commerce platform built with PHP, MySQL, HTML5, CSS3, and JavaScript. This project showcases professional web development capabilities and serves as a portfolio piece demonstrating full-stack e-commerce development skills.

### ✨ Key Features

- **Modern Responsive Design** - Mobile-first approach with beautiful UI/UX
- **Complete E-commerce Functionality** - Shopping cart, checkout, order management
- **User Authentication** - Registration, login, password reset
- **Product Management** - Categories, variants, reviews, wishlist
- **Admin Dashboard** - Order management, product management, analytics
- **Payment Integration** - Ready for Stripe, PayPal integration
- **SEO Optimized** - Clean URLs, meta tags, structured data
- **Security Features** - CSRF protection, input validation, secure sessions

## 🚀 Live Demo

**Demo URL**: `https://stylehub-demo.devtone.agency`

**Admin Access**:
- Email: `admin@stylehub.com`
- Password: `admin123`

**Test Customer**:
- Email: `john@example.com`
- Password: `password`

## 🛠️ Technology Stack

### Backend
- **PHP 8.0+** - Server-side scripting
- **MySQL 8.0+** - Database management
- **PDO** - Database abstraction layer
- **Sessions** - User authentication

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **JavaScript ES6+** - Interactive functionality
- **Font Awesome** - Icon library
- **Google Fonts** - Typography

### Features
- **Responsive Design** - Mobile, tablet, desktop optimized
- **AJAX** - Dynamic content loading
- **Form Validation** - Client and server-side
- **Image Optimization** - Automatic resizing and compression

## 📋 Installation Guide

### Prerequisites
- **Web Server** (Apache/Nginx)
- **PHP 8.0+** with extensions:
  - PDO MySQL
  - GD Library
  - cURL
  - OpenSSL
- **MySQL 8.0+**
- **Composer** (optional, for dependencies)

### Step 1: Download & Extract
```bash
# Download the project
git clone https://github.com/devtone-agency/stylehub-ecommerce.git
cd stylehub-ecommerce

# Or extract from ZIP
unzip stylehub-ecommerce.zip
cd stylehub-ecommerce
```

### Step 2: Database Setup
```sql
-- Create database
CREATE DATABASE stylehub_ecommerce;

-- Import database structure and sample data
mysql -u root -p stylehub_ecommerce < database/stylehub_database.sql
```

### Step 3: Configuration
```php
// Edit config/database.php
define('DB_HOST', 'localhost');
define('DB_NAME', 'stylehub_ecommerce');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');

// Update site URL
define('SITE_URL', 'http://your-domain.com');
```

### Step 4: File Permissions
```bash
# Set proper permissions
chmod 755 assets/images/uploads/
chmod 755 assets/images/products/
chmod 755 logs/
```

### Step 5: Web Server Configuration

#### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

#### Nginx
```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}

location ~ \.php$ {
    fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
}
```

## 📁 Project Structure

```
stylehub-ecommerce/
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
│       ├── products/
│       ├── categories/
│       └── uploads/
├── config/
│   └── database.php
├── includes/
│   └── functions.php
├── pages/
│   ├── products.php
│   ├── cart.php
│   ├── checkout.php
│   └── account.php
├── admin/
│   ├── dashboard.php
│   ├── products.php
│   └── orders.php
├── ajax/
│   ├── add-to-cart.php
│   ├── search.php
│   └── newsletter.php
├── database/
│   └── stylehub_database.sql
├── logs/
├── index.php
└── README.md
```

## 🎨 Design Features

### Color Scheme
- **Primary**: #6366f1 (Indigo)
- **Secondary**: #8b5cf6 (Purple)
- **Success**: #10b981 (Emerald)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)

### Typography
- **Primary Font**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Responsive Grid System**
- **Modern Card Layouts**
- **Smooth Animations**
- **Interactive Buttons**
- **Form Styling**
- **Modal Windows**

## 🔧 Customization

### Adding New Products
```php
// Use admin panel or direct database insert
INSERT INTO products (name, slug, description, price, category_id, image) 
VALUES ('Product Name', 'product-slug', 'Description', 99.99, 1, 'image.jpg');
```

### Custom Styling
```css
/* Add to assets/css/style.css */
.custom-component {
    /* Your custom styles */
}
```

### JavaScript Extensions
```javascript
// Add to assets/js/main.js
function customFunction() {
    // Your custom functionality
}
```

## 🔒 Security Features

- **CSRF Protection** - All forms protected
- **Input Validation** - Server-side validation
- **SQL Injection Prevention** - Prepared statements
- **XSS Protection** - Output escaping
- **Secure Sessions** - Proper session handling
- **Password Hashing** - bcrypt encryption

## 📱 Mobile Optimization

- **Responsive Design** - Works on all devices
- **Touch-Friendly** - Optimized for mobile interaction
- **Fast Loading** - Optimized images and code
- **Progressive Enhancement** - Works without JavaScript

## 🚀 Performance

- **Optimized Database** - Proper indexing
- **Image Compression** - Automatic optimization
- **Minified Assets** - Compressed CSS/JS
- **Caching** - Browser and server-side caching
- **CDN Ready** - Easy CDN integration

## 📊 Analytics & SEO

- **Google Analytics Ready** - Easy integration
- **SEO Optimized** - Meta tags, structured data
- **Clean URLs** - Search engine friendly
- **Sitemap Generation** - Automatic sitemap
- **Social Media Tags** - Open Graph, Twitter Cards

## 🎯 Portfolio Showcase

This project demonstrates:

### Technical Skills
- **Full-Stack Development** - Complete e-commerce solution
- **Database Design** - Normalized, efficient schema
- **Security Implementation** - Industry best practices
- **Responsive Design** - Mobile-first approach
- **Performance Optimization** - Fast, efficient code

### Business Understanding
- **E-commerce Flow** - Complete customer journey
- **User Experience** - Intuitive, user-friendly design
- **Admin Management** - Comprehensive backend
- **Payment Processing** - Secure transaction handling
- **Inventory Management** - Stock tracking and management

## 🏆 DevTone Agency Credits

**Developed by**: DevTone Agency  
**Website**: https://devtone.agency  
**Email**: info@devtone.agency  

### Our Services
- **Custom E-commerce Development**
- **Responsive Web Design**
- **Database Design & Optimization**
- **Payment Gateway Integration**
- **SEO & Performance Optimization**
- **Ongoing Maintenance & Support**

## 📞 Support & Contact

For questions about this project or to discuss your e-commerce development needs:

**DevTone Agency**  
📧 Email: info@devtone.agency  
🌐 Website: https://devtone.agency  
📱 Portfolio: https://devtone.agency/portfolio  

### Professional Services Available
- **Custom E-commerce Solutions**
- **Website Redesign & Optimization**
- **Payment Gateway Integration**
- **Mobile App Development**
- **Digital Marketing & SEO**

## 📄 License

This project is created for portfolio demonstration purposes by DevTone Agency. 

**For Commercial Use**: Contact DevTone Agency for licensing and customization services.

---

**© 2024 DevTone Agency. Professional Web Development & Digital Solutions.**
