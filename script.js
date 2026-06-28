// ===================================================
// Will Burguer — Lógica do Carrinho e Pedido
// ===================================================

// Configurações da loja
const STORE_CONFIG = {
    phone: "5562981989026",        // Número WhatsApp (DDI + DDD + número)
    openHour: 17,                  // Hora de abertura
    closeHour: 23,                 // Hora de fechamento
};

// Referências ao DOM
const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('modal-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const addressInput = document.getElementById('address-delivery');
const addressWarn = document.getElementById('address-warn');
const spanItem = document.getElementById('date-span');

// Estado do carrinho
let cart = [];

// ===================================================
// MODAL
// ===================================================

cartBtn.addEventListener("click", function () {
    updateCartUI();
    cartModal.style.display = "flex";
});

cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

// ===================================================
// CARRINHO — ADICIONAR / REMOVER
// ===================================================

menu.addEventListener("click", function (event) {
    const parentButton = event.target.closest(".btncar");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

function addToCart(name, price) {
    const existItem = cart.find(item => item.name === name);

    if (existItem) {
        existItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartUI();
}

cartItems.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-button")) {
        const name = event.target.getAttribute("data-name");
        removeFromCart(name);
    }
});

function removeFromCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index === -1) return;

    const item = cart[index];

    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart.splice(index, 1);
    }

    updateCartUI();
}

// ===================================================
// ATUALIZAR UI DO CARRINHO
// ===================================================

function updateCartUI() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.innerHTML = `
        <div class="cart-item">
            <div class="item-info">
                <p class="item-name">${item.name}</p>
                <p class="item-qtd">Qtd: ${item.quantity}</p>
                <p class="item-price">R$ ${item.price.toFixed(2)}</p>
            </div>
            <div>
                <button class="remove-button" data-name="${item.name}">Remover</button>
            </div>
        </div>`;
        total += item.price * item.quantity;
        cartItems.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    });

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;
}

// ===================================================
// FINALIZAR PEDIDO — WHATSAPP
// ===================================================

checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) return;

    if (addressInput.value.trim() === "") {
        addressWarn.style.display = "block";
        return;
    }

    addressWarn.style.display = "none";

    if (!isStoreOpen()) {
        Toastify({
            text: "Olá, no momento estamos fechados!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: { background: "#ff0000" },
        }).showToast();
        return;
    }

    const cartText = cart.map(item =>
        `${item.name} - Qtd: (${item.quantity}) - R$ ${item.price.toFixed(2)}`
    ).join(" | ");

    const message = encodeURIComponent(`${cartText} | Endereço: ${addressInput.value.trim()}`);
    window.open(`https://wa.me/${STORE_CONFIG.phone}?text=${message}`, "_blank");

    cart = [];
    updateCartUI();
    cartModal.style.display = "none";
});

// ===================================================
// STATUS DA LOJA (ABERTO / FECHADO)
// ===================================================

function isStoreOpen() {
    const hour = new Date().getHours();
    return hour >= STORE_CONFIG.openHour && hour < STORE_CONFIG.closeHour;
}

// Atualizar cor do indicador de horário
spanItem.style.backgroundColor = isStoreOpen() ? "#1cce1ccd" : "#ff0000b0";
spanItem.style.borderRadius = "3px";

// Validação do campo de endereço em tempo real
addressInput.addEventListener("input", function (event) {
    addressWarn.style.display = event.target.value.trim().length > 0 ? "none" : "block";
});
