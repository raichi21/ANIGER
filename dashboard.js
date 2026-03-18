// Global charts object
let charts = {};

// Initialize dashboard
function initializeDashboard(userType) {
    // Check authentication
    const auth = checkAuth();
    
    if (userType === 'admin') {
        if (!auth.staff) {
            window.location.href = 'staff-login.html';
            return;
        }
        if (auth.staff.role !== 'Admin') {
            window.location.href = 'staff-dashboard.html';
            return;
        }
    }

    if (userType === 'cashier') {
        if (!auth.staff) {
            window.location.href = 'staff-login.html';
            return;
        }
        if (auth.staff.role !== 'Cashier' && auth.staff.role !== 'Admin') {
            window.location.href = 'staff-dashboard.html';
            return;
        }
    }

    if (userType === 'customer' && !auth.customer) {
        window.location.href = 'customer-login.html';
        return;
    }

    // Set user name (if element exists)
    if (auth.staff) {
        const userNameEl = document.getElementById('userName');
        if (userNameEl) {
            userNameEl.textContent = auth.staff.name || 'User';
        }
    } else if (auth.customer) {
        const userNameEl = document.getElementById('userName');
        if (userNameEl) {
            userNameEl.textContent = auth.customer.firstName || 'Customer';
        }
    }
}

// Switch dashboard sections
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

    // Hide all sections
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) section.classList.add('active');

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    if (clickedItem) clickedItem.classList.add('active');

    // Reinitialize charts if needed
    if (sectionId === 'analytics' || sectionId === 'monitoring') {
        setTimeout(() => {
            if (charts.revenue) {
                charts.revenue.resize();
            }
            if (charts.sales) {
                charts.sales.resize();
            }
        }, 100);
    }
}

// Initialize charts
function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        charts.sales = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Sales',
                    data: [2000, 2500, 3500, 3000, 4500, 5000],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointBackgroundColor: '#10B981',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        charts.category = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Groceries', 'Beverages', 'Snacks', 'Toiletries', 'Other'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#10B981',
                        '#3B82F6',
                        '#F59E0B',
                        '#A855F7',
                        '#EF4444'
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        charts.revenue = new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenue (₱)',
                    data: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 74000, 79000, 85000, 92000],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: '#10B981',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

// Format currency
function formatCurrency(value) {
    return '₱' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Notification functions
function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    const isVisible = dropdown.style.display === 'block';
    
    if (isVisible) {
        dropdown.style.display = 'none';
    } else {
        dropdown.style.display = 'block';
    }
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
        dropdown.style.display = 'none';
    }
});

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
