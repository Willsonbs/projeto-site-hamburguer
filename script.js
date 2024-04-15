const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItems = document.getElementsByTagName('cart-items')
const cartTotal = document.getElementById('total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCount = document.getElementById('cart-count')
const addressInput = document.getElementById('address-delivery')
const deliveryWarn = document.getElementById('delivery-warn')

cartBtn.addEventListener("click", function () {
    cartModal.style.display = "flex"
})