// Sample Products (without prices)
const products = [
    { id: 1, name: "Macbook M2 GOLD", image: "images/m4-gold.png" },
    { id: 2, name: "Macbook M1 SILVER", image: "images/m1-white.png" },
    { id: 3, name: "Macbook M3 NAVY", image: "images/m2-navy.jpg" },
    { id: 4, name: "Macbook M3 SPACE GRAY", image: "images/m-purple.webp" },
    { id: 5, name: "Macbook PRO M4 SILVER", image: "images/pro-back.webp" },
    { id: 6, name: "Macbook M3 BLACK", image: "images/m4-pro.webp" },
    { id: 7, name: "Macbook M1 PINK", image: "images/pinkm1.jpg" },
    { id: 8, name: "Macbook M2 NAVY", image: "images/m3-blue.png" }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartBadge();
    observeProducts();
});

// Render Products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" id="productImg-${product.id}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}, this)">
                    ➕
                </button>
            </div>
        </div>
    `).join('');
}

// Fly to Cart Animation
function flyToCart(productId, buttonElement) {
    const productImg = document.getElementById(`productImg-${productId}`);
    const cartIcon = document.getElementById('cartIcon');
    const container = document.getElementById('flyingImageContainer');
    
    // Get positions
    const imgRect = productImg.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();
    
    // Create flying image
    const flyingImg = document.createElement('img');
    flyingImg.src = productImg.src;
    flyingImg.className = 'flying-image';
    flyingImg.style.left = imgRect.left + imgRect.width / 2 - 40 + 'px';
    flyingImg.style.top = imgRect.top + imgRect.height / 2 - 40 + 'px';
    
    container.appendChild(flyingImg);
    
    // Trigger animation after a small delay
    requestAnimationFrame(() => {
        flyingImg.style.left = cartRect.left + cartRect.width / 2 - 10 + 'px';
        flyingImg.style.top = cartRect.top + cartRect.height / 2 - 10 + 'px';
        flyingImg.classList.add('fly');
    });
    
    // Remove after animation
    setTimeout(() => {
        flyingImg.remove();
    }, 800);
}

// Add to Cart
function addToCart(productId, buttonElement) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    // Fly animation
    flyToCart(productId, buttonElement);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartBadge();
    shakeCart();
    showToast(`${product.name} added to cart!`);
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartBadge();
    renderCartItems();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCartItems();
        }
    }
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart Badge
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'block' : 'none';
}

// Shake Cart Animation
function shakeCart() {
    const cartIcon = document.getElementById('cartIcon');
    cartIcon.classList.add('shake');
    setTimeout(() => cartIcon.classList.remove('shake'), 500);
}

// Show Toast
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// Open Cart
function openCart() {
    document.getElementById('cartDrawer').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');
    document.body.classList.add('cart-open'); // Prevent scroll
    renderCartItems();
}

// Close Cart
function closeCartDrawer() {
    document.getElementById('cartDrawer').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
    document.body.classList.remove('cart-open'); // Re-enable scroll
}

// Render Cart Items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">&times;</button>
        </div>
    `).join('');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    showToast('Enjoy new computer🎉');
    cart = [];
    saveCart();
    updateCartBadge();
    renderCartItems();
    setTimeout(closeCartDrawer, 1500);
}

// Scroll Animation Observer
function observeProducts() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
}
