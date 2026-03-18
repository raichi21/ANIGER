// Storage Keys
const STORAGE_KEYS = {
    STAFF: 'iloursari_staff_user',
    CUSTOMER: 'iloursari_customer_user',
    CUSTOMER_LIST: 'iloursari_customers',
    REMEMBERED_EMAIL: 'iloursari_remembered_email'
};

// Mock database for demo purposes
const MOCK_STAFF = [
    { id: 1, email: 'admin@iloursari.com', password: 'admin123', role: 'Admin', name: 'Admin User' },
    { id: 2, email: 'cashier@iloursari.com', password: 'cashier123', role: 'Cashier', name: 'Maria Santos' },
    { id: 3, email: 'staff@iloursari.com', password: 'staff123', role: 'Staff', name: 'Juan Dela Cruz' }
];

// Customer storage helpers
function getStoredCustomers() {
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMER_LIST);
    return stored ? JSON.parse(stored) : [];
}

function saveStoredCustomers(customers) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_LIST, JSON.stringify(customers));
}

function findCustomerByEmail(email) {
    const customers = getStoredCustomers();
    return customers.find(c => c.email.toLowerCase() === email.toLowerCase());
}

// Toggle Password Visibility
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const toggleButton = button || document.querySelector(`.toggle-password[onclick*="${inputId}"]`);

    if (!input || !toggleButton) return;

    if (input.type === 'password') {
        input.type = 'text';
        toggleButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        input.type = 'password';
        toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Tab Switching for Customer Login/Signup
function switchTab(clickedButton, tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (clickedButton) clickedButton.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const targetTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetTab) targetTab.classList.add('active');

    // Clear errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

// Form Validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10,}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

// Clear Error Messages
function clearErrors(formType) {
    const errorIds = {
        staff: ['emailError', 'passwordError'],
        admin: ['emailError', 'passwordError'],
        customerLogin: ['loginEmailError', 'loginPasswordError'],
        signup: ['firstNameError', 'lastNameError', 'signupEmailError', 'signupPasswordError', 'confirmPasswordError', 'phoneError', 'termsError']
    };
    if (errorIds[formType]) {
        errorIds[formType].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '';
        });
    }
}

// Staff & Cashier Login
function handleStaffLogin(email, password, rememberMe) {
    clearErrors('staff');
    let hasError = false;

    // Validation
    if (!validateEmail(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        hasError = true;
    }

    if (!validatePassword(password)) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
        hasError = true;
    }

    if (hasError) return;

    // Find staff in mock database
    const user = MOCK_STAFF.find(u => u.email === email && u.password === password);

    if (!user) {
        document.getElementById('emailError').textContent = 'Invalid email or password';
        return;
    }

    if (user.role === 'Admin') {
        document.getElementById('emailError').textContent = 'Please use the admin login page';
        return;
    }

    // Store session
    const userSession = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(userSession));

    // Remember email
    if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, email);
    } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
    }

    // Redirect to dashboard
    let redirectUrl = '';
    if (user.role === 'Cashier') {
        redirectUrl = 'pos-dashboard.html';
    } else if (user.role === 'Staff') {
        redirectUrl = 'staff-dashboard.html';
    }

    window.location.href = redirectUrl;
}

// Admin Login
function handleAdminLogin(email, password, rememberMe) {
    clearErrors('admin');
    let hasError = false;

    // Validation
    if (!validateEmail(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        hasError = true;
    }

    if (!validatePassword(password)) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
        hasError = true;
    }

    if (hasError) return;

    // Find admin in mock database
    const user = MOCK_STAFF.find(u => u.email === email && u.password === password);

    if (!user || user.role !== 'Admin') {
        document.getElementById('emailError').textContent = 'Invalid admin credentials';
        return;
    }

    // Store session
    const userSession = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(userSession));

    // Remember email
    if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, email);
    } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
    }

    // Redirect to admin dashboard
    window.location.href = 'admin-dashboard.html';
}

// Customer Login
function handleCustomerLogin(email, password, rememberMe) {
    clearErrors('customerLogin');
    let hasError = false;

    // Validation
    if (!validateEmail(email)) {
        document.getElementById('loginEmailError').textContent = 'Please enter a valid email address';
        hasError = true;
    }

    if (!validatePassword(password)) {
        document.getElementById('loginPasswordError').textContent = 'Password must be at least 6 characters';
        hasError = true;
    }

    if (hasError) return;

    // Check stored customers (from signup)
    const customers = getStoredCustomers();
    let customer = null;

    if (customers.length > 0) {
        customer = customers.find(c => c.email.toLowerCase() === email.toLowerCase() && c.password === password);
        if (!customer) {
            document.getElementById('loginEmailError').textContent = 'Invalid email or password';
            return;
        }
    } else {
        // Fallback for demo: allow any credentials if no signup has occurred yet.
        customer = {
            id: Math.random().toString(36).substr(2, 9),
            email: email,
            firstName: email.split('@')[0]
        };
    }

    // Store session
    const customerSession = {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(customerSession));

    if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, email);
    } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
    }

    // Redirect to customer dashboard
    window.location.href = 'customer-dashboard.html';
}

// Customer Signup
function handleCustomerSignup(data) {
    clearErrors('signup');
    let hasError = false;

    // Validation
    if (!data.firstName.trim()) {
        document.getElementById('firstNameError').textContent = 'First name is required';
        hasError = true;
    }

    if (!data.lastName.trim()) {
        document.getElementById('lastNameError').textContent = 'Last name is required';
        hasError = true;
    }

    if (!validateEmail(data.email)) {
        document.getElementById('signupEmailError').textContent = 'Please enter a valid email address';
        hasError = true;
    }

    if (!validatePassword(data.password)) {
        document.getElementById('signupPasswordError').textContent = 'Password must be at least 6 characters';
        hasError = true;
    }

    if (data.password !== data.confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
        hasError = true;
    }

    if (!validatePhone(data.phone)) {
        document.getElementById('phoneError').textContent = 'Please enter a valid phone number';
        hasError = true;
    }

    if (!document.getElementById('agreeTerms').checked) {
        document.getElementById('termsError').textContent = 'You must agree to the terms and conditions';
        hasError = true;
    }

    if (hasError) return;

    // Prevent duplicate accounts
    const existingCustomer = findCustomerByEmail(data.email);
    if (existingCustomer) {
        document.getElementById('signupEmailError').textContent = 'An account with this email already exists';
        return;
    }

    // Create new customer
    const newCustomer = {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        signupTime: new Date().toISOString()
    };

    const customers = getStoredCustomers();
    customers.push(newCustomer);
    saveStoredCustomers(customers);

    // Create session and redirect
    const customerSession = {
        id: newCustomer.id,
        email: newCustomer.email,
        firstName: newCustomer.firstName,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(customerSession));

    window.location.href = 'customer-dashboard.html';
}

// Social Login Functions
function handleGoogleLogin() {
    alert('Google login integration would be implemented here.\nFor demo, using test email.');
    handleCustomerLogin('customer@gmail.com', 'password123', false);
}

function handleFacebookLogin() {
    alert('Facebook login integration would be implemented here.\nFor demo, using test email.');
    handleCustomerLogin('customer@facebook.com', 'password123', false);
}

function handleGoogleSignup() {
    alert('Google signup integration would be implemented here.');
}

function handleFacebookSignup() {
    alert('Facebook signup integration would be implemented here.');
}

// Load remembered email
function loadRememberedEmail() {
    const email = localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL);
    if (email) {
        const emailInput = document.getElementById('loginEmail') || document.getElementById('email');
        if (emailInput) {
            emailInput.value = email;
            const checkbox = document.getElementById('rememberMeCustomer') || document.getElementById('rememberMe');
            if (checkbox) checkbox.checked = true;
        }
    }
}

// Check authentication
function checkAuth() {
    const staffUser = localStorage.getItem(STORAGE_KEYS.STAFF);
    const customerUser = localStorage.getItem(STORAGE_KEYS.CUSTOMER);

    return {
        staff: staffUser ? JSON.parse(staffUser) : null,
        customer: customerUser ? JSON.parse(customerUser) : null
    };
}

// Logout
function logout() {
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMER);
    window.location.href = 'index.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadRememberedEmail();
});
