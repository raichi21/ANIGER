// Staff Inventory Data
const staffData = {
    inventory: [
        { id: 1, name: 'Rice (50kg)', category: 'Groceries', stock: 45, unit: 'sacks', min: 10, status: 'OK' },
        { id: 2, name: 'Cooking Oil', category: 'Groceries', stock: 12, unit: 'bottles', min: 5, status: 'LOW' },
        { id: 3, name: 'Sugar (1kg)', category: 'Groceries', stock: 30, unit: 'packs', min: 15, status: 'OK' },
        { id: 4, name: 'Salt', category: 'Groceries', stock: 50, unit: 'packs', min: 20, status: 'OK' },
        { id: 5, name: 'Coke (500ml)', category: 'Beverages', stock: 100, unit: 'bottles', min: 30, status: 'OK' },
        { id: 6, name: 'Sprite (500ml)', category: 'Beverages', stock: 85, unit: 'bottles', min: 30, status: 'OK' },
        { id: 7, name: 'Water (1.5L)', category: 'Beverages', stock: 120, unit: 'bottles', min: 40, status: 'OK' },
        { id: 8, name: 'Bread', category: 'Bakery', stock: 40, unit: 'packs', min: 15, status: 'OK' },
        { id: 9, name: 'Milk (1L)', category: 'Dairy', stock: 25, unit: 'bottles', min: 10, status: 'OK' },
        { id: 10, name: 'Eggs (1 dozen)', category: 'Dairy', stock: 15, unit: 'cartons', min: 5, status: 'LOW' }
    ],
    movements: [],
    suppliers: [
        { id: 1, name: 'ABC Supplies', contact: '0917-123-4567', email: 'abc@example.com' },
        { id: 2, name: 'XYZ Trading', contact: '0918-234-5678', email: 'xyz@example.com' }
    ]
};

// Initialize Staff Dashboard
function initializeStaffDashboard() {
    loadInventoryTable();
    setupFormHandlers();
}

// Load Inventory Table
function loadInventoryTable() {
    const table = document.getElementById('inventoryTable');
    table.innerHTML = staffData.inventory.map(item => {
        const statusBadge = item.status === 'LOW' 
            ? '<span class="status-badge warning">Low Stock</span>' 
            : '<span class="status-badge">OK</span>';
        
        return `
            <tr>
                <td>#${item.id}</td>
                <td><strong>${item.name}</strong></td>
                <td>${item.category}</td>
                <td>${item.stock}</td>
                <td>${item.unit}</td>
                <td>${item.min}</td>
                <td>${statusBadge}</td>
                <td style="text-align: center;">
                    <button onclick="editItem(${item.id})" style="background: none; border: none; color: #3B82F6; cursor: pointer; font-size: 14px;">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Setup Form Handlers
function setupFormHandlers() {
    const stockInForm = document.getElementById('stockInForm');
    const stockOutForm = document.getElementById('stockOutForm');

    if (stockInForm) {
        stockInForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleStockIn();
        });
    }

    if (stockOutForm) {
        stockOutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleStockOut();
        });
    }
}

// Handle Stock In
function handleStockIn() {
    const itemId = parseInt(document.getElementById('stockInItem').value);
    const quantity = parseInt(document.getElementById('stockInQty').value);
    const supplier = document.getElementById('stockInSupplier').value;

    if (!itemId || !quantity || !supplier) {
        alert('Please fill in all fields');
        return;
    }

    const item = staffData.inventory.find(i => i.id === itemId);
    if (!item) return;

    // Update inventory
    item.stock += quantity;
    if (item.stock >= item.min) {
        item.status = 'OK';
    }

    // Record movement
    staffData.movements.push({
        type: 'IN',
        item: item.name,
        quantity: quantity,
        supplier: supplier,
        time: new Date().toLocaleTimeString(),
        date: new Date()
    });

    // Clear form
    document.getElementById('stockInForm').reset();
    alert('Stock In recorded successfully!');
    loadInventoryTable();
}

// Handle Stock Out
function handleStockOut() {
    const itemId = parseInt(document.getElementById('stockOutItem').value);
    const quantity = parseInt(document.getElementById('stockOutQty').value);
    const reason = document.getElementById('stockOutReason').value;

    if (!itemId || !quantity) {
        alert('Please fill in all fields');
        return;
    }

    const item = staffData.inventory.find(i => i.id === itemId);
    if (!item) return;

    if (item.stock < quantity) {
        alert('Insufficient stock');
        return;
    }

    // Update inventory
    item.stock -= quantity;
    if (item.stock < item.min) {
        item.status = 'LOW';
    }

    // Record movement
    staffData.movements.push({
        type: 'OUT',
        item: item.name,
        quantity: quantity,
        reason: reason,
        time: new Date().toLocaleTimeString(),
        date: new Date()
    });

    // Clear form
    document.getElementById('stockOutForm').reset();
    alert('Stock Out recorded successfully!');
    loadInventoryTable();
}

// Edit Item
function editItem(itemId) {
    const item = staffData.inventory.find(i => i.id === itemId);
    if (item) {
        alert(`Editing: ${item.name}\nCurrent Stock: ${item.stock}`);
        // In a real app, this would open a modal or form
    }
}

// Switch Dashboard
function switchDashboard(sectionId) {
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');

    // Setup forms when switching to stock view
    if (sectionId === 'stock') {
        setupFormHandlers();
    }
}
