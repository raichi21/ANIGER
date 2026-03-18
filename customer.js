// Customer Store Data
const customerStore = {
    products: [
        { id: 1, name: 'Rice (50kg)', category: 'Groceries', price: 850, stock: 45, icon: '🍚' },
        { id: 2, name: 'Cooking Oil', category: 'Groceries', price: 250, stock: 12, icon: '🍴' },
        { id: 3, name: 'Sugar (1kg)', category: 'Groceries', price: 65, stock: 30, icon: '🍯' },
        { id: 4, name: 'Salt', category: 'Groceries', price: 45, stock: 50, icon: '⚪' },
        { id: 5, name: 'Coke (500ml)', category: 'Beverages', price: 35, stock: 100, icon: '🥤' },
        { id: 6, name: 'Sprite (500ml)', category: 'Beverages', price: 35, stock: 85, icon: '🥤' },
        { id: 7, name: 'Water (1.5L)', category: 'Beverages', price: 25, stock: 120, icon: '💧' },
        { id: 8, name: 'Bread', category: 'Bakery', price: 45, stock: 40, icon: '🍞' },
        { id: 9, name: 'Milk (1L)', category: 'Dairy', price: 85, stock: 25, icon: '🥛' },
        { id: 10, name: 'Eggs (1 dozen)', category: 'Dairy', price: 90, stock: 15, icon: '🥚' },
        { id: 11, name: 'Soap', category: 'Toiletries', price: 30, stock: 60, icon: '🧼' },
        { id: 12, name: 'Shampoo', category: 'Toiletries', price: 85, stock: 20, icon: '🧴' }
    ],
    cart: [],
    currentFilter: 'all'
};

// Initialize Customer Dashboard
function initializeCustomerDashboard() {
    const auth = checkAuth();
    
    if (!auth.customer) {
        window.location.href = 'customer-login.html';
        return;
    }

    document.getElementById('userName').textContent = auth.customer.firstName || 'Customer';
    
    loadProducts('all');
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchProducts');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchProducts(e.target.value);
        });
    }
}

// Load Products
function loadProducts(category = 'all') {
    const productsGrid = document.getElementById('productsGrid');
    let products = customerStore.products;

    if (category !== 'all') {
        products = products.filter(p => p.category === category);
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">₱${product.price}</div>
                <div class="product-stock">${product.stock} in stock</div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                    <button class="btn-quick-view" onclick="openQuickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    customerStore.currentFilter = category;
}

// Filter by Category
function filterByCategory(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    loadProducts(category);
}

// Search Products
function searchProducts(query) {
    const productsGrid = document.getElementById('productsGrid');
    const filtered = customerStore.products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No products found</p>';
        return;
    }

    productsGrid.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">₱${product.price}</div>
                <div class="product-stock">${product.stock} in stock</div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                    <button class="btn-quick-view" onclick="openQuickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Sort Products
function sortProducts() {
    const sortValue = document.getElementById('sortSelect').value;
    let products = [...customerStore.products];

    switch(sortValue) {
        case 'price-low':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            products = [...customerStore.products];
    }

    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">₱${product.price}</div>
                <div class="product-stock">${product.stock} in stock</div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                    <button class="btn-quick-view" onclick="openQuickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add to Cart
function addToCart(productId) {
    const product = customerStore.products.find(p => p.id === productId);
    if (!product || product.stock === 0) {
        alert('Product out of stock');
        return;
    }

    const cartItem = customerStore.cart.find(item => item.id === productId);

    if (cartItem) {
        if (cartItem.quantity < product.stock) {
            cartItem.quantity += 1;
        }
    } else {
        customerStore.cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            icon: product.icon,
            quantity: 1
        });
    }

    updateCart();
    alert('Added to cart!');
}

// Remove from Cart
function removeFromCart(productId) {
    customerStore.cart = customerStore.cart.filter(item => item.id !== productId);
    updateCart();
}

// Update Cart Display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');

    cartCount.textContent = customerStore.cart.length;

    if (customerStore.cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = customerStore.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.icon}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₱${item.price}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateCartSummary();
}

// Update Quantity
function updateQuantity(productId, change) {
    const cartItem = customerStore.cart.find(item => item.id === productId);
    const product = customerStore.products.find(p => p.id === productId);

    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
        } else if (cartItem.quantity > product.stock) {
            cartItem.quantity = product.stock;
        } else {
            updateCart();
        }
    }
}

// Update Cart Summary
function updateCartSummary() {
    const subtotal = customerStore.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 50;
    const total = subtotal + shipping;

    document.getElementById('cartSubtotal').textContent = '₱' + subtotal.toLocaleString();
    document.getElementById('cartTotal').textContent = '₱' + total.toLocaleString();
}

// Toggle Cart
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

// Toggle User Menu
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
            dropdown.classList.remove('active');
        }
    });
}

// Open Quick View
function openQuickView(productId) {
    const product = customerStore.products.find(p => p.id === productId);
    if (!product) return;

    const content = document.getElementById('quickViewContent');
    content.innerHTML = `
        <div class="quick-view-details">
            <div class="quick-view-image">${product.icon}</div>
            <h2>${product.name}</h2>
            <div style="color: var(--text-secondary); margin-bottom: 10px;">
                <strong>Category:</strong> ${product.category}
            </div>
            <div class="price">₱${product.price}</div>
            <div class="description">
                <p>High-quality ${product.name.toLowerCase()} from Lourdes Sari-Sari Store.</p>
                <p style="margin-top: 10px;">Stock available: ${product.stock} units</p>
            </div>
            <div class="quick-view-actions">
                <button class="btn-primary btn-large" style="flex: 1;" onclick="addToCart(${product.id}); closeQuickView();">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn-text" style="flex: 1;" onclick="closeQuickView();">
                    Close
                </button>
            </div>
        </div>
    `;

    document.getElementById('quickViewModal').classList.add('active');
}

// Close Quick View
function closeQuickView() {
    document.getElementById('quickViewModal').classList.remove('active');
}

// Proceed to Checkout
function proceedToCheckout() {
    if (customerStore.cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    alert('Checkout feature coming soon!\n\nYour items: ' + customerStore.cart.length);
}

// Notification functions
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;

    dropdown.classList.toggle('active');
}

function markAllAsRead() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    unreadItems.forEach(item => {
        item.classList.remove('unread');
    });
    
    // Update badge count
    const badge = document.querySelector('.notification-btn .badge');
    if (badge) {
        badge.textContent = '0';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('notificationDropdown');
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (dropdown && notificationBtn && !notificationBtn.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('active');
    }
});
