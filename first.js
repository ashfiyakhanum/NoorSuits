
// ==========================================
// NOORSUITS - COMPLETE JAVASCRIPT
// All pages in one file: first.js
// ==========================================


// 1. PRODUCT DATABASE
const products = [
    { id: "printed-lawn", name: "Printed Lawn Suit", price: 1499, image: "unstiched1.jpeg", category: "unstitched", fabric: "Premium Lawn" },
    { id: "floral-lawn", name: "Floral Lawn Suit", price: 1799, image: "printedlawn.jpeg", category: "unstitched", fabric: "Floral Lawn" },
    { id: "green-suit", name: "Green Traditional Suit", price: 2499, image: "green.jpeg", category: "stitched", fabric: "Traditional Fabric" },
    { id: "chikankari", name: "Chikankari Suit", price: 2999, image: "chikankari.jpeg", category: "stitched", fabric: "Chikankari" },
    { id: "party-wear", name: "Elegant Party Wear Suit", price: 3499, image: "partywear.jpeg", category: "partywear", fabric: "Premium Fabric" },
    { id: "formal-party", name: "Formal Embroidered Suit", price: 3999, image: "formalpartywear.jpeg", category: "partywear", fabric: "Embroidered Fabric" },
    { id: "casual-suit", name: "Daily Wear Suit", price: 1299, image: "casual.jpeg", category: "casual", fabric: "Cotton" },
    { id: "cotton-suit", name: "Classic Cotton Suit", price: 1599, image: "cotton.jpeg", category: "casual", fabric: "Cotton" },
    { id: "dupatta", name: "Designer Dupatta", price: 799, image: "dupatta.jpeg", category: "dupatta", fabric: "Designer Fabric" },
    { id: "embroidered-suit", name: "Beautiful Embroidered Suit", price: 2499, image: "embroider.jpeg", category: "embroidery", fabric: "Embroidered Lawn" }
];


// 2. COMMON FUNCTIONS

function getCart() {
    return JSON.parse(localStorage.getItem("noorsuitsCart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("noorsuitsCart", JSON.stringify(cart));
    updateCartCount();
}

function formatPrice(price) {
    return "₹" + Number(price).toLocaleString("en-IN");
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = count;
    });

    document.querySelectorAll('a[href="cart.html"]').forEach(link => {
        if (!link.querySelector(".cart-count")) {
            const badge = document.createElement("span");
            badge.className = "cart-count";
            link.appendChild(badge);
        }
        link.querySelector(".cart-count").textContent = count;
    });
}


// 3. FIND PRODUCT

function findProduct(id) {
    return products.find(product => product.id === id);
}


// 4. ADD PRODUCT TO CART

function addToCart(product, size = "M", quantity = 1) {

    if (!product) {
        alert("Product not found!");
        return;
    }

    let cart = getCart();

    const existingProduct = cart.find(item =>
        item.id === product.id && item.size === size
    );

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({
            ...product,
            size: size,
            quantity: quantity
        });
    }

    saveCart(cart);

    alert(product.name + " added to your cart!");
}


// 5. HOMEPAGE AND SHOP PAGE

function initializeShop() {

    const cards = document.querySelectorAll(".product-card");

    cards.forEach(card => {

        const nameElement = card.querySelector("h3");
        const imageElement = card.querySelector("img");
        const priceElement = card.querySelector(".price");

        if (!nameElement || !imageElement || !priceElement) return;

        const productName = nameElement.textContent.trim();

        const product = products.find(item =>
            item.name.toLowerCase() === productName.toLowerCase()
        );

        if (!product) return;

        // Give product links their own product ID
        card.querySelectorAll('a[href="product.html"]').forEach(link => {
            link.href = "product.html?id=" + product.id;
        });

        // Add to cart
        const addButton = card.querySelector(".add-to-cart");

        if (addButton) {
            addButton.addEventListener("click", function(event) {
                event.preventDefault();
                addToCart(product);
            });
        }
    });

    initializeSearch();
    initializeFilters();
}


// 6. SEARCH PRODUCTS

function initializeSearch() {

    const searchInput = document.querySelector(".search-box input");
    const searchButton = document.querySelector(".search-box button");

    if (!searchInput) return;

    function searchProducts() {

        const searchText = searchInput.value.toLowerCase();

        document.querySelectorAll(".product-card").forEach(card => {

            const name = card.textContent.toLowerCase();

            card.style.display = name.includes(searchText) ? "" : "none";
        });
    }

    searchButton?.addEventListener("click", searchProducts);

    searchInput.addEventListener("input", searchProducts);
}


// 7. FILTER AND SORT PRODUCTS

function initializeFilters() {

    const selects = document.querySelectorAll(".filter-options select");

    if (!selects.length) return;

    function applyFilters() {

        const cards = [...document.querySelectorAll(".product-card")];

        const category = selects[0]?.value.toLowerCase() || "";
        const priceFilter = selects[1]?.value.toLowerCase() || "";
        const sortFilter = selects[2]?.value.toLowerCase() || "";

        cards.forEach(card => {

            const productName = card.querySelector("h3")?.textContent.trim();

            const product = products.find(item => item.name === productName);

            if (!product) return;

            let show = true;

            if (category && category !== "all" && category !== "all categories") {
                show = product.category === category;
            }

            if (priceFilter.includes("under")) {
                show = show && product.price < 2000;
            }

            if (priceFilter.includes("2000") || priceFilter.includes("2,000")) {
                show = show && product.price >= 2000 && product.price <= 3000;
            }

            if (priceFilter.includes("above")) {
                show = show && product.price > 3000;
            }

            card.style.display = show ? "" : "none";
        });

        const visibleCards = cards.filter(card => card.style.display !== "none");

        if (sortFilter.includes("low")) {
            visibleCards.sort((a, b) => getPrice(a) - getPrice(b));
        } else if (sortFilter.includes("high")) {
            visibleCards.sort((a, b) => getPrice(b) - getPrice(a));
        }

        visibleCards.forEach(card => {
            card.parentElement.appendChild(card);
        });
    }

    selects.forEach(select => {
        select.addEventListener("change", applyFilters);
    });
}

function getPrice(card) {
    const productName = card.querySelector("h3")?.textContent.trim();
    return products.find(item => item.name === productName)?.price || 0;
}


// 8. PRODUCT DETAILS PAGE

function initializeProductPage() {

    if (!document.querySelector(".product-info")) return;

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    const product = findProduct(productId);

    if (!product) {
        console.log("Showing the default product details.");
        return;
    }

    const info = document.querySelector(".product-info");

    const heading = info.querySelector("h1");
    const price = info.querySelector(".price");
    const description = info.querySelector("p");
    const mainImage = document.querySelector(".product-gallery img");

    if (heading) heading.textContent = product.name;
    if (price) price.textContent = formatPrice(product.price);
    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = product.name;
    }

    if (description) {
        description.textContent = product.name + " made with " + product.fabric + ".";
    }

    // Add to cart button
    const addButton = document.querySelector(".add-cart");

    addButton?.addEventListener("click", function(event) {

        event.preventDefault();

        const size = document.querySelector('input[name="size"]:checked')?.value;

        const quantity = Math.max(
            1,
            Number(document.querySelector(".quantity input")?.value || 1)
        );

        if (!size) {
            alert("Please select a size.");
            return;
        }

        addToCart(product, size, quantity);
    });

    // Buy now button
    const buyButton = document.querySelector(".buy-now");

    buyButton?.addEventListener("click", function(event) {

        event.preventDefault();

        const size = document.querySelector('input[name="size"]:checked')?.value;

        const quantity = Math.max(
            1,
            Number(document.querySelector(".quantity input")?.value || 1)
        );

        if (!size) {
            alert("Please select a size.");
            return;
        }

        addToCart(product, size, quantity);
        window.location.href = "checkout.html";
    });

    // Product image thumbnails
    document.querySelectorAll(".product-gallery .small-images img").forEach(image => {

        image.addEventListener("click", function() {
            if (mainImage) mainImage.src = image.src;
        });
    });
}


// 9. CART PAGE

function initializeCartPage() {

    const container = document.querySelector(".cart-products");

    if (!container) return;

    function displayCart() {

        const cart = getCart();

        container.querySelectorAll(".cart-item").forEach(item => item.remove());

        if (cart.length === 0) {

            const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "Your cart is empty. Start shopping!";
            container.appendChild(emptyMessage);

            updateCartTotals(0);
            return;
        }

        let subtotal = 0;

        cart.forEach((item, index) => {

            subtotal += item.price * item.quantity;

            const row = document.createElement("div");
            row.className = "cart-item";

            row.innerHTML = `
                <div class="cart-product-info">
                    <img src="${item.image}" alt="${item.name}" width="80">
                    <div>
                        <h3>${item.name}</h3>
                        <p>Size: ${item.size}</p>
                        <p>${formatPrice(item.price)}</p>
                    </div>
                </div>

                <div>
                    <input type="number" min="1" value="${item.quantity}"
                        class="cart-quantity" data-index="${index}">
                </div>

                <div>${formatPrice(item.price * item.quantity)}</div>

                <a href="#" class="remove-item" data-index="${index}">Remove</a>
            `;

            container.appendChild(row);
        });

        updateCartTotals(subtotal);
    }

    function updateCartTotals(subtotal) {

        const delivery = subtotal > 0 ? 0 : 0;
        const total = subtotal + delivery;

        const summary = document.querySelector(".cart-summary");

        if (!summary) return;

        const values = summary.querySelectorAll("p, h3");

        values.forEach(element => {

            const text = element.textContent.toLowerCase();

            if (text.includes("subtotal")) {
                element.innerHTML = "Subtotal: " + formatPrice(subtotal);
            }

            if (text.includes("delivery")) {
                element.innerHTML = "Delivery: " + formatPrice(delivery);
            }

            if (text.includes("total")) {
                element.innerHTML = "Total: " + formatPrice(total);
            }
        });
    }

    container.addEventListener("change", function(event) {

        if (event.target.classList.contains("cart-quantity")) {

            const index = Number(event.target.dataset.index);
            const quantity = Math.max(1, Number(event.target.value));

            const cart = getCart();

            if (cart[index]) {
                cart[index].quantity = quantity;
                saveCart(cart);
                displayCart();
            }
        }
    });

    container.addEventListener("click", function(event) {

        if (event.target.classList.contains("remove-item")) {

            event.preventDefault();

            const index = Number(event.target.dataset.index);

            const cart = getCart();
            cart.splice(index, 1);

            saveCart(cart);
            displayCart();
        }
    });

    displayCart();
}


// 10. CHECKOUT PAGE

function initializeCheckout() {

    const form = document.querySelector(".customer-details form");

    if (!form) return;

    displayCheckoutSummary();

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        const cart = getCart();

        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const inputs = form.querySelectorAll("input:not([type=radio]), textarea");

        for (const input of inputs) {
            if (!input.value.trim()) {
                alert("Please fill all delivery details.");
                input.focus();
                return;
            }
        }

        const mobile = form.querySelector('input[type="tel"]');

        if (mobile && !/^[6-9]\d{9}$/.test(mobile.value.trim())) {
            alert("Please enter a valid 10-digit mobile number.");
            mobile.focus();
            return;
        }

        const payment = document.querySelector('input[name="payment"]:checked');

        if (!payment) {
            alert("Please select a payment method.");
            return;
        }

        const order = {
            orderId: "NS" + Date.now(),
            items: cart,
            customer: Object.fromEntries(new FormData(form).entries()),
            payment: payment.value,
            date: new Date().toLocaleString()
        };

        const orders = JSON.parse(localStorage.getItem("noorsuitsOrders")) || [];

        orders.push(order);

        localStorage.setItem("noorsuitsOrders", JSON.stringify(orders));
        localStorage.removeItem("noorsuitsCart");

        alert("Order placed successfully! Your order ID is " + order.orderId);

        window.location.href = "index.html";
    });
}


function displayCheckoutSummary() {

    const summary = document.querySelector(".order-summary");

    if (!summary) return;

    const cart = getCart();

    if (cart.length === 0) {
        summary.textContent = "Your cart is empty.";
        return;
    }

    let total = 0;

    summary.innerHTML = "<h2>Order Summary</h2>";

    cart.forEach(item => {

        const amount = item.price * item.quantity;
        total += amount;

        const product = document.createElement("p");

        product.textContent =
            item.name + " | Size: " + item.size +
            " | Qty: " + item.quantity +
            " | " + formatPrice(amount);

        summary.appendChild(product);
    });

    const totalElement = document.createElement("h3");
    totalElement.textContent = "Total: " + formatPrice(total);

    summary.appendChild(totalElement);
}


// 11. CONTACT PAGE

function initializeContactPage() {

    const form = document.querySelector(".contact-form form");

    if (!form) return;

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        alert("Thank you! Your message has been received.");

        form.reset();
    });
}


// 12. RUN THE CORRECT FUNCTION ON EACH PAGE

document.addEventListener("DOMContentLoaded", function() {

    updateCartCount();

    initializeShop();
    initializeProductPage();
    initializeCartPage();
    initializeCheckout();
    initializeContactPage();

    console.log("NoorSuits JavaScript loaded successfully!");
});
