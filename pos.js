// POS Data
const posData = {
    products: [
        { id: 1, name: 'Rice (50kg)', price: 850, stock: 45, icon: '🍚', category: 'Groceries', branchStock: { main: 45, second: 20, third: 15 } },
        { id: 2, name: 'Cooking Oil', price: 250, stock: 12, icon: '🍴', category: 'Groceries', branchStock: { main: 12, second: 8, third: 6 } },
        { id: 3, name: 'Sugar (1kg)', price: 65, stock: 30, icon: '🍯', category: 'Groceries', branchStock: { main: 30, second: 15, third: 10 } },
        { id: 4, name: 'Salt', price: 45, stock: 50, icon: '⚪', category: 'Groceries', branchStock: { main: 50, second: 35, third: 20 } },
        { id: 5, name: 'Coke (500ml)', price: 35, stock: 100, icon: '🥤', category: 'Beverages', branchStock: { main: 100, second: 80, third: 60 } },
        { id: 6, name: 'Sprite (500ml)', price: 35, stock: 85, icon: '🥤', category: 'Beverages', branchStock: { main: 85, second: 60, third: 45 } },
        { id: 7, name: 'Water (1.5L)', price: 25, stock: 120, icon: '💧', category: 'Beverages', branchStock: { main: 120, second: 90, third: 70 } },
        { id: 8, name: 'Bread', price: 45, stock: 40, icon: '🍞', category: 'Bakery', branchStock: { main: 40, second: 25, third: 18 } },
        { id: 9, name: 'Milk (1L)', price: 85, stock: 25, icon: '🥛', category: 'Dairy', branchStock: { main: 25, second: 18, third: 12 } },
        { id: 10, name: 'Eggs (1 dozen)', price: 90, stock: 15, icon: '🥚', category: 'Dairy', branchStock: { main: 15, second: 10, third: 8 } },
        { id: 11, name: 'Soap', price: 30, stock: 60, icon: '🧼', category: 'Toiletries', branchStock: { main: 60, second: 40, third: 30 } },
        { id: 12, name: 'Shampoo', price: 85, stock: 20, icon: '🧴', category: 'Toiletries', branchStock: { main: 20, second: 15, third: 12 } }
    ],
    cart: [],
    sales: [],
    reservations: [
        { id: 'RES001', customer: 'Juan Dela Cruz', branch: 'Main Branch', items: 'Rice, Cooking Oil', status: 'Pending' },
        { id: 'RES002', customer: 'Maria Santos', branch: '2nd Branch', items: 'Snacks, Water', status: 'Confirmed' }
    ],
    payments: []
};

// Initialize POS
function initializePOS() {
    loadProducts();
    loadMonitoringTable();
    loadReservationsTable();
    loadPaymentsTable();
}

// Load Products
function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    posData.products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => addToCart(product.id);
        card.innerHTML = `
            <div class="product-icon">${product.icon}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">₱${product.price}</div>
            <div class="product-stock">${product.stock} in stock</div>
        `;
        productGrid.appendChild(card);
    });
}

// Add to Cart
function addToCart(productId) {
    const product = posData.products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;

    const cartItem = posData.cart.find(item => item.id === productId);

    if (cartItem) {
        if (cartItem.quantity < product.stock) {
            cartItem.quantity += 1;
        }
    } else {
        posData.cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCart();
}

// Remove from Cart
function removeFromCart(productId) {
    posData.cart = posData.cart.filter(item => item.id !== productId);
    updateCart();
}

// Update Cart Display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    
    if (posData.cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Cart is empty</p>';
    } else {
        cartItems.innerHTML = posData.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₱${item.price}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="cart-item-total">₱${(item.price * item.quantity).toLocaleString()}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    updateCartSummary();
}

// Update Quantity
function updateQuantity(productId, change) {
    const cartItem = posData.cart.find(item => item.id === productId);
    const product = posData.products.find(p => p.id === productId);

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

// Clear Cart
function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        posData.cart = [];
        updateCart();
    }
}

// Update Cart Summary
function updateCartSummary() {
    const subtotal = posData.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = 0;
    const tax = subtotal * 0.12;
    const total = subtotal - discount + tax;

    document.getElementById('subtotal').textContent = '₱' + subtotal.toLocaleString();
    document.getElementById('discount').textContent = '₱' + discount.toLocaleString();
    document.getElementById('tax').textContent = '₱' + tax.toLocaleString();
    document.getElementById('total').textContent = '₱' + total.toLocaleString();

    // Update cash received change
    const cashReceived = parseFloat(document.getElementById('cashReceived').value) || 0;
    const changeDisplay = document.getElementById('changeDisplay');
    
    if (cashReceived > 0 && cashReceived >= total) {
        const change = cashReceived - total;
        changeDisplay.textContent = `Change: ₱${change.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
        changeDisplay.style.background = 'rgba(16, 185, 129, 0.1)';
        changeDisplay.style.color = '#059669';
    } else if (cashReceived > 0 && cashReceived < total) {
        const shortage = total - cashReceived;
        changeDisplay.textContent = `Shortage: ₱${shortage.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
        changeDisplay.style.background = 'rgba(239, 68, 68, 0.1)';
        changeDisplay.style.color = '#DC2626';
    } else {
        changeDisplay.textContent = '';
    }
}

// Process Payment
function processPayment() {
    if (posData.cart.length === 0) {
        alert('Cart is empty');
        return;
    }

    const subtotal = posData.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.12;
    const total = subtotal + tax;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const cashReceived = parseFloat(document.getElementById('cashReceived').value) || 0;

    if (paymentMethod === 'cash' && cashReceived < total) {
        alert('Insufficient cash');
        return;
    }

    if (paymentMethod === 'gcash') {
        // For GCash, assume payment is successful (in real app, integrate with GCash API)
        alert('GCash payment processed successfully');
    }

    // Record sale
    const saleId = 'ORD' + String(posData.sales.length + 1).padStart(4, '0');
    const sale = {
        id: saleId,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        items: posData.cart.length,
        amount: total,
        payment: paymentMethod,
        date: new Date()
    };

    posData.sales.push(sale);

    // Record payment (for pickup tracking)
    const paymentRecord = {
        id: 'PAY' + String(posData.payments.length + 1).padStart(4, '0'),
        orderId: saleId,
        amount: total,
        method: paymentMethod,
        status: 'Pending',
        pickup: 'Pending'
    };
    posData.payments.push(paymentRecord);

    // Show receipt
    showReceipt(sale, subtotal, tax, total);

    // Clear cart
    posData.cart = [];
    document.getElementById('cashReceived').value = '';
    updateCart();

    // Refresh tables if currently viewing them
    loadSalesTable();
    loadPaymentsTable();
}

// Show Receipt
function showReceipt(sale, subtotal, tax, total) {
    const receiptDate = new Date().toLocaleDateString() + ' ' + sale.time;
    document.getElementById('receiptDate').textContent = receiptDate;

    const receiptItems = document.getElementById('receiptItems');
    receiptItems.innerHTML = `
        <div class="receipt-items">
            ${posData.cart.map(item => `
                <div class="receipt-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>₱${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            `).join('')}
            <div class="receipt-item">
                <span>Subtotal</span>
                <span>₱${subtotal.toLocaleString()}</span>
            </div>
            <div class="receipt-item">
                <span>Tax (12%)</span>
                <span>₱${tax.toLocaleString()}</span>
            </div>
        </div>
    `;

    document.getElementById('receiptTotal').textContent = '₱' + total.toLocaleString();

    // Show modal
    document.getElementById('receiptModal').classList.add('active');
}

// Close Modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Print Receipt
function printReceipt() {
    window.print();
}

// Switch Dashboard
function switchDashboard(arg1, arg2) {
    // Support old call signature: switchDashboard(sectionId)
    let clickedItem = null;
    let sectionId = null;

    if (typeof arg1 === 'string') {
        sectionId = arg1;
    } else {
        clickedItem = arg1;
        sectionId = arg2;
    }

    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });
    const section = document.getElementById(sectionId);
    if (section) section.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    if (clickedItem) clickedItem.classList.add('active');

    // Load data based on section
    if (sectionId === 'inventory') {
        loadInventoryTable();
    } else if (sectionId === 'sales') {
        loadSalesTable();
    } else if (sectionId === 'monitoring') {
        loadMonitoringTable();
    } else if (sectionId === 'reservations') {
        loadReservationsTable();
    } else if (sectionId === 'payments') {
        loadPaymentsTable();
    }
}

// Load Inventory Table
function loadInventoryTable() {
    const table = document.getElementById('inventoryTable');
    table.innerHTML = posData.products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.stock}</td>
            <td>₱${product.price}</td>
            <td>Main Supplier</td>
            <td>
                ${product.stock > 20 ? '<span class="status-badge">In Stock</span>' : '<span class="status-badge warning">Low Stock</span>'}
            </td>
        </tr>
    `).join('');
}

// Load Sales Table
function loadSalesTable() {
    const table = document.getElementById('salesTable');
    const totalSales = posData.sales.reduce((sum, sale) => sum + sale.amount, 0);
    const avgSale = posData.sales.length > 0 ? totalSales / posData.sales.length : 0;

    document.getElementById('totalTransactions').textContent = posData.sales.length;
    document.getElementById('totalSales').textContent = '₱' + totalSales.toLocaleString();
    document.getElementById('avgTransaction').textContent = '₱' + avgSale.toLocaleString();

    table.innerHTML = posData.sales.map(sale => `
        <tr>
            <td>${sale.id}</td>
            <td>${sale.time}</td>
            <td>${sale.items}</td>
            <td>₱${sale.amount.toLocaleString()}</td>
            <td>${sale.payment}</td>
        </tr>
    `).join('');
}

// Load Monitoring Table
function loadMonitoringTable() {
    const table = document.getElementById('monitoringTable');
    table.innerHTML = posData.products.map(product => {
        const totalStock = product.branchStock.main + product.branchStock.second + product.branchStock.third;
        const status = totalStock > 30 ? 'Stock ok' : 'Low stock';
        const statusClass = totalStock > 30 ? 'status-badge active' : 'status-badge warning';
        return `
            <tr>
                <td>${product.name}</td>
                <td>${product.branchStock.main}</td>
                <td>${product.branchStock.second}</td>
                <td>${product.branchStock.third}</td>
                <td><span class="${statusClass}">${status}</span></td>
            </tr>
        `;
    }).join('');
}

// Load Reservations Table
function loadReservationsTable() {
    const table = document.getElementById('reservationsTable');
    table.innerHTML = posData.reservations.map(reservation => `
        <tr>
            <td>${reservation.id}</td>
            <td>${reservation.customer}</td>
            <td>${reservation.items}</td>
            <td>${reservation.branch}</td>
            <td><span class="status-badge ${reservation.status === 'Confirmed' ? 'active' : 'warning'}">${reservation.status}</span></td>
            <td>
                ${reservation.status === 'Pending' ? `<button class="btn-secondary" onclick="confirmReservation('${reservation.id}')">Confirm</button>` : '<span style="opacity:0.7;">—</span>'}
            </td>
        </tr>
    `).join('');
}

function confirmReservation(reservationId) {
    const reservation = posData.reservations.find(r => r.id === reservationId);
    if (!reservation) return;

    reservation.status = 'Confirmed';
    loadReservationsTable();
    alert(`Reservation ${reservationId} confirmed.`);
}

// Load Payments Table
function loadPaymentsTable() {
    const table = document.getElementById('paymentsTable');
    const methodFilter = document.getElementById('paymentMethodFilter')?.value || 'all';
    const statusFilter = document.getElementById('paymentStatusFilter')?.value || 'all';

    const filteredPayments = posData.payments.filter(payment => {
        if (methodFilter !== 'all' && payment.method !== methodFilter) return false;
        if (statusFilter !== 'all' && payment.status.toLowerCase() !== statusFilter) return false;
        return true;
    });

    updatePaymentSummary();

    table.innerHTML = filteredPayments.map(payment => `
        <tr>
            <td>${payment.id}</td>
            <td>${payment.orderId}</td>
            <td>₱${payment.amount.toLocaleString()}</td>
            <td>${payment.method}</td>
            <td><span class="status-badge ${payment.status === 'Completed' ? 'success' : 'warning'}">${payment.status}</span></td>
            <td>
                ${payment.pickup === 'Completed' ? '✅' : `<button class="btn-secondary" onclick="markPickup('${payment.id}')">Mark Picked</button>`}
            </td>
            <td>
                ${payment.status === 'Pending' ? `<button class="btn-secondary" onclick="validatePayment('${payment.id}')">Validate</button>` : '<span style="opacity:0.7;">—</span>'}
            </td>
        </tr>
    `).join('');
}

function markPickup(paymentId) {
    const payment = posData.payments.find(p => p.id === paymentId);
    if (!payment) return;

    payment.pickup = 'Completed';
    loadPaymentsTable();
}

function validatePayment(paymentId) {
    const payment = posData.payments.find(p => p.id === paymentId);
    if (!payment) return;

    payment.status = 'Completed';
    loadPaymentsTable();
}

function updatePaymentSummary() {
    const summaryEl = document.getElementById('paymentSummary');
    if (!summaryEl) return;

    const total = posData.payments.reduce((sum, p) => sum + p.amount, 0);
    const completed = posData.payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
    const pending = posData.payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);

    summaryEl.innerHTML = `
        <div class="summary-card">
            <h4>Total</h4>
            <p>₱${total.toLocaleString()}</p>
        </div>
        <div class="summary-card">
            <h4>Completed</h4>
            <p>₱${completed.toLocaleString()}</p>
        </div>
        <div class="summary-card">
            <h4>Pending</h4>
            <p>₱${pending.toLocaleString()}</p>
        </div>
    `;
}

// Handle cash received input
document.addEventListener('DOMContentLoaded', () => {
    const cashInput = document.getElementById('cashReceived');
    if (cashInput) {
        cashInput.addEventListener('input', updateCartSummary);
    }
});
