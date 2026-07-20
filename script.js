// script.js
(function() {
    "use strict";

    // ---- DOM refs ----
    const cartCountSpan = document.getElementById('cartCount');
    const cartItemsDiv = document.getElementById('cartItems');
    const totalPriceSpan = document.getElementById('totalPrice');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const orderBtn = document.getElementById('orderBtn');
    const menuToggle = document.getElementById('menuToggle');
    const menuGrid = document.getElementById('menuGrid');
    const themeToggle = document.getElementById('themeToggle');
    const surpriseBtn = document.getElementById('surpriseBtn');
    const sizeBtns = document.querySelectorAll('.size-btn');
    const extraChecks = document.querySelectorAll('.extra-check');
    const toast = document.getElementById('toast');

    // ---- state ----
    let cart = [];
    let selectedSize = 'medium';
    let menuVisible = true;
    let toastTimeout = null;

    // ---- menu data ----
    const menuItems = [
        { name: 'Americano', price: 4.5, icon: 'fa-mug-hot' },
        { name: 'Latte', price: 5.0, icon: 'fa-mug-saucer' },
        { name: 'Cappuccino', price: 5.5, icon: 'fa-cup-togo' },
        { name: 'Espresso', price: 3.5, icon: 'fa-martini-soda' },
        { name: 'Mocha', price: 5.8, icon: 'fa-chocolate' },
        { name: 'Cold Brew', price: 4.8, icon: 'fa-whiskey-glass' }
    ];

    // ---- toast ----
    function showToast(message) {
        if (toastTimeout) {
            clearTimeout(toastTimeout);
            toast.classList.remove('show');
        }
        toast.textContent = message;
        toast.classList.add('show');
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            toastTimeout = null;
        }, 2800);
    }

    // ---- render menu ----
    function renderMenu() {
        menuGrid.innerHTML = '';
        menuItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'menu-item';
            div.innerHTML = `
                <i class="fas ${item.icon}"></i>
                <div class="item-name">${item.name}</div>
                <div class="item-price">$${item.price.toFixed(2)}</div>
            `;
            div.addEventListener('click', () => {
                addToCart(item.name, item.price);
                showToast(`☕ added ${item.name} to cart`);
            });
            menuGrid.appendChild(div);
        });
    }

    // ---- cart functions ----
    function updateCartUI() {
        cartCountSpan.textContent = cart.length;
        if (cart.length === 0) {
            cartItemsDiv.innerHTML = `<div class="empty-cart">☕ no items yet</div>`;
            totalPriceSpan.textContent = '$0.00';
            return;
        }
        let html = '';
        let total = 0;
        cart.forEach((item) => {
            const extrasStr = item.extras && item.extras.length > 0 ? ` + ${item.extras.join(', ')}` : '';
            html += `
                <div class="cart-item">
                    <span class="item-detail">${item.size} ${item.name}${extrasStr}</span>
                    <span class="item-price">$${item.price.toFixed(2)}</span>
                </div>
            `;
            total += item.price;
        });
        cartItemsDiv.innerHTML = html;
        totalPriceSpan.textContent = `$${total.toFixed(2)}`;
    }

    function addToCart(name, basePrice) {
        let price = basePrice;
        if (selectedSize === 'large') price += 1.2;
        else if (selectedSize === 'small') price -= 0.8;
        const extras = [];
        extraChecks.forEach(cb => {
            if (cb.checked) {
                extras.push(cb.value);
                price += 0.5;
            }
        });
        cart.push({
            name: name,
            size: selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1),
            extras: extras,
            price: parseFloat(price.toFixed(2))
        });
        updateCartUI();
        // feedback
        addToCartBtn.style.transform = 'scale(0.95)';
        setTimeout(() => addToCartBtn.style.transform = 'scale(1)', 150);
    }

    function clearCart() {
        if (cart.length === 0) {
            showToast('☕ cart is already empty');
            return;
        }
        cart = [];
        updateCartUI();
        showToast('🗑️ cart cleared');
    }

    // ---- order / checkout ----
    function placeOrder() {
        if (cart.length === 0) {
            showToast('☕ add some coffee first!');
            return;
        }
        const total = cart.reduce((sum, i) => sum + i.price, 0);
        showToast(`✅ order placed! total: $${total.toFixed(2)}`);
        cart = [];
        updateCartUI();
    }

    // ---- size selection ----
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedSize = this.dataset.size;
        });
    });

    // ---- toggle menu ----
    function toggleMenu() {
        const menuSection = document.getElementById('menuSection');
        if (menuVisible) {
            menuSection.style.display = 'none';
            menuToggle.innerHTML = '<i class="fas fa-list"></i> show menu';
        } else {
            menuSection.style.display = 'block';
            menuToggle.innerHTML = '<i class="fas fa-list"></i> hide menu';
        }
        menuVisible = !menuVisible;
    }

    // ---- theme toggle ----
    function toggleTheme() {
        const shop = document.getElementById('mainShop');
        const icon = themeToggle.querySelector('i');
        const body = document.body;
        const isDark = icon.classList.contains('fa-sun');

        if (isDark) {
            // switch to dark
            shop.style.background = 'rgba(30, 20, 15, 0.92)';
            shop.style.borderColor = 'rgba(166, 124, 82, 0.2)';
            body.style.background = '#1a1310';
            body.style.backgroundImage = 'radial-gradient(circle at 70% 20%, rgba(180, 130, 80, 0.08) 0%, transparent 50%)';
            // text colors
            document.querySelectorAll('.logo, .hero h1, .section-title, .panel-header, .summary-header, .cart-total, .menu-item .item-name')
                .forEach(el => el.style.color = '#f5ede6');
            document.querySelectorAll('.hero p, .control-item label, .cart-item, .item-price, .footer-note, .extra-group label')
                .forEach(el => el.style.color = '#cbb5a8');
            document.querySelectorAll('.size-btn').forEach(el => el.style.color = '#cbb5a8');
            document.querySelectorAll('.size-btn.active').forEach(el => el.style.color = '#fdf8f3');
            document.querySelector('.cart-badge').style.color = '#f5ede6';
            document.querySelector('.nav-icon').style.color = '#f5ede6';
            icon.className = 'fas fa-moon';
            showToast('🌙 night mode activated');
        } else {
            // switch to light
            shop.style.background = 'rgba(255, 250, 245, 0.8)';
            shop.style.borderColor = 'rgba(180, 130, 80, 0.12)';
            body.style.background = '#f7f2eb';
            body.style.backgroundImage = 'radial-gradient(circle at 70% 20%, rgba(180, 130, 80, 0.05) 0%, transparent 50%)';
            document.querySelectorAll('.logo, .hero h1, .section-title, .panel-header, .summary-header, .cart-total, .menu-item .item-name')
                .forEach(el => el.style.color = '#2c1f16');
            document.querySelectorAll('.hero p, .control-item label, .cart-item, .item-price, .footer-note, .extra-group label')
                .forEach(el => el.style.color = '#6b5342');
            document.querySelectorAll('.size-btn').forEach(el => el.style.color = '#3d2b1f');
            document.querySelectorAll('.size-btn.active').forEach(el => el.style.color = '#fdf8f3');
            document.querySelector('.cart-badge').style.color = '#3d2b1f';
            document.querySelector('.nav-icon').style.color = '#3d2b1f';
            icon.className = 'fas fa-sun';
            showToast('☀️ light mode activated');
        }
    }

    // ---- surprise (easter egg) ----
    function surprise() {
        const surpriseDrinks = [
            { name: 'Butter Beer Latte', price: 6.5 },
            { name: 'Matcha Dream', price: 5.8 },
            { name: 'Vanilla Sweet Cream', price: 5.2 },
            { name: 'Lavender Honey', price: 6.0 },
            { name: 'Cinnamon Spice', price: 5.5 }
        ];
        const random = surpriseDrinks[Math.floor(Math.random() * surpriseDrinks.length)];
        addToCart(random.name, random.price);
        showToast(`✨ secret menu: ${random.name} added!`);
    }

    // ---- event listeners ----
    addToCartBtn.addEventListener('click', function() {
        addToCart('Latte', 5.0);
        showToast('☕ latte added to cart');
    });

    clearCartBtn.addEventListener('click', clearCart);
    orderBtn.addEventListener('click', placeOrder);
    menuToggle.addEventListener('click', toggleMenu);
    themeToggle.addEventListener('click', toggleTheme);
    surpriseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        surprise();
    });

    // ---- keyboard shortcuts ----
    document.addEventListener('keydown', function(e) {
        if (e.key === 'o' || e.key === 'O') {
            e.preventDefault();
            placeOrder();
        } else if (e.key === 'c' || e.key === 'C') {
            e.preventDefault();
            clearCart();
        } else if (e.key === 'm' || e.key === 'M') {
            e.preventDefault();
            toggleMenu();
        } else if (e.key === 't' || e.key === 'T') {
            e.preventDefault();
            toggleTheme();
        } else if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            surprise();
        }
    });

    // ---- init ----
    renderMenu();
    updateCartUI();
    // pre-select medium
    document.querySelector('.size-btn[data-size="medium"]').classList.add('active');

    // show welcome toast
    setTimeout(() => {
        showToast('☕ welcome to Brew Haven!');
    }, 600);

})();