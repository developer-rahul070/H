
/* =================================
   DARKORA - HALLOWEEN STORE
   JavaScript Part 3
================================= */

// 1. Select HTML elements
const menuButton = document.getElementById("menuButton");
const navbar = document.getElementById("navbar");

const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");

const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const cartMessage = document.getElementById("cartMessage");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");

const productGrid = document.getElementById("productGrid");
const noProducts = document.getElementById("noProducts");


// 2. Shopping cart storage
let cart = [];


// 3. Mobile menu
if (menuButton && navbar) {
    menuButton.addEventListener("click", () => {
        navbar.classList.toggle("active");
    });

    navbar.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navbar.classList.remove("active");
        });
    });
}


// 4. Open and close cart
if (cartButton && cartModal) {
    cartButton.addEventListener("click", () => {
        cartModal.hidden = false;
        renderCart();
    });
}

if (closeCart && cartModal) {
    closeCart.addEventListener("click", () => {
        cartModal.hidden = true;
    });
}

// Close cart by clicking outside the cart box
if (cartModal) {
    cartModal.addEventListener("click", event => {
        if (event.target === cartModal) {
            cartModal.hidden = true;
        }
    });
}


// 5. Add product to cart
if (productGrid) {
    productGrid.addEventListener("click", event => {
        const addButton = event.target.closest(".add-button");
        const wishlistButton = event.target.closest(".wishlist-button");

        // Add to cart
        if (addButton) {
            const productCard = addButton.closest(".product-card");

            if (!productCard) return;

            const id = productCard.dataset.id;
            const name = productCard.dataset.name;
            const price = Number(productCard.dataset.price);

            if (!id || !name || !Number.isFinite(price)) return;

            const existingProduct = cart.find(item => item.id === id);

            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }

            renderCart();

            const originalText = addButton.textContent;
            addButton.textContent = "✓ ADDED!";
            addButton.disabled = true;

            setTimeout(() => {
                addButton.textContent = originalText;
                addButton.disabled = false;
            }, 900);
        }

        // Wishlist
        if (wishlistButton) {
            wishlistButton.classList.toggle("liked");

            const isLiked =
                wishlistButton.classList.contains("liked");

            wishlistButton.textContent = isLiked ? "♥" : "♡";
            wishlistButton.setAttribute(
                "aria-pressed",
                String(isLiked)
            );
        }
    });
}


// 6. Render shopping cart
function renderCart() {
    if (!cartItems || !cartTotal || !cartCount) return;

    cartItems.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                🎃 Your cart is waiting for some spooky style!
            </p>
        `;
    }

    cart.forEach(item => {
        total += item.price * item.quantity;
        totalQuantity += item.quantity;

        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";

        itemElement.innerHTML = `
            <div class="cart-item-info">
                <h4></h4>
                <p>
                    ₹${item.price.toLocaleString("en-IN")}
                    × ${item.quantity}
                </p>
            </div>

            <div class="cart-item-actions">
                <button class="quantity-btn"
                    data-action="decrease"
                    data-id="${item.id}"
                    aria-label="Decrease quantity">−</button>

                <span>${item.quantity}</span>

                <button class="quantity-btn"
                    data-action="increase"
                    data-id="${item.id}"
                    aria-label="Increase quantity">+</button>

                <button class="remove-btn"
                    data-action="remove"
                    data-id="${item.id}">Remove</button>
            </div>
        `;

        itemElement.querySelector("h4").textContent = item.name;
        cartItems.appendChild(itemElement);
    });

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = `₹${total.toLocaleString("en-IN")}`;
}


// 7. Increase, decrease or remove cart products
if (cartItems) {
    cartItems.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const id = button.dataset.id;
        const action = button.dataset.action;
        const item = cart.find(product => product.id === id);

        if (!item) return;

        if (action === "increase") {
            item.quantity++;
        }

        if (action === "decrease") {
            item.quantity--;

            if (item.quantity <= 0) {
                cart = cart.filter(product => product.id !== id);
            }
        }

        if (action === "remove") {
            cart = cart.filter(product => product.id !== id);
        }

        if (cartMessage) cartMessage.textContent = "";

        renderCart();
    });
}


// 8. Search and category filter
function filterProducts() {
    if (!productGrid) return;

    const cards = [
        ...productGrid.querySelectorAll(".product-card")
    ];

    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const selectedCategory = categoryFilter
        ? categoryFilter.value.toLowerCase()
        : "all";

    let visibleCount = 0;

    cards.forEach(card => {
        const name = (
            card.dataset.name ||
            card.textContent
        ).toLowerCase();

        const category = (
            card.dataset.category || ""
        ).toLowerCase();

        const matchesSearch = name.includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;

        const isVisible = matchesSearch && matchesCategory;

        card.hidden = !isVisible;

        if (isVisible) visibleCount++;
    });

    if (noProducts) {
        noProducts.hidden = visibleCount !== 0;
    }
}

if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", filterProducts);
}


// 9. Sort products by price
if (sortSelect && productGrid) {
    sortSelect.addEventListener("change", () => {
        const cards = [
            ...productGrid.querySelectorAll(".product-card")
        ];

        const sortValue = sortSelect.value;

        cards.sort((a, b) => {
            const priceA = Number(a.dataset.price) || 0;
            const priceB = Number(b.dataset.price) || 0;

            if (sortValue === "low-high") {
                return priceA - priceB;
            }

            if (sortValue === "high-low") {
                return priceB - priceA;
            }

            return 0;
        });

        cards.forEach(card => productGrid.appendChild(card));

        filterProducts();
    });
}


// 10. Collection cards filter products
document.querySelectorAll(".collection-card[data-category]")
    .forEach(card => {
        card.addEventListener("click", () => {
            if (!categoryFilter) return;

            categoryFilter.value = card.dataset.category;
            filterProducts();

            const shopSection = document.getElementById("shop");

            if (shopSection) {
                shopSection.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });


// 11. Newsletter form
const newsletterForm = document.getElementById("newsletterForm");
const emailInput = document.getElementById("emailInput");
const newsletterMessage =
    document.getElementById("newsletterMessage");

if (newsletterForm) {
    newsletterForm.addEventListener("submit", event => {
        event.preventDefault();

        if (!emailInput || !newsletterMessage) return;

        if (!emailInput.checkValidity()) {
            emailInput.reportValidity();
            return;
        }

        newsletterMessage.textContent =
            "🎃 Thanks for joining the DARKORA spooky club!";

        newsletterForm.reset();
    });
}


// 12. Checkout demo
if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
            if (cartMessage) {
                cartMessage.textContent =
                    "Your cart is empty. Add a costume first!";
            }
            return;
        }

        if (cartMessage) {
            cartMessage.textContent =
                "✨ Cart ready! Online payment and order processing need a backend.";
        }
    });
}


// 13. Current year in footer
const yearElement = document.getElementById("currentYear");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// 14. Initial cart display
renderCart();

console.log("🎃 DARKORA Halloween Store is ready!");
