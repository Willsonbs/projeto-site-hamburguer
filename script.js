const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('modal-cart')
const cartItems = document.getElementById('cart-items')
const cartTotal = document.getElementById('total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address-delivery')
const addressWarn = document.getElementById('address-warn')


let cart = [];

//abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCart();
    cartModal.style.display = "flex"
})

//fechar o modal do carrinho clica fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

//fechar o modal clicando em fechar
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

//click no carrinho
menu.addEventListener("click", function(event) {
    //console.log(event.target);
    
    let parentButton = event.target.closest(".btncar")
    
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

//funcao para adicionar no carrinho
function addToCart(name, price){
    const existItem = cart.find(item => item.name === name)

    if(existItem){
        existItem.quantity += 1;
        
    }

    else {
        cart.push ({
            name: name,
            price: price,
            quantity: 1,
        })
    }

    updateCart()
}

//Atualiza carrinho
function updateCart(){
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        

        cartItemElement.innerHTML = `       
        <div class="cart-item">
            <div class="item-info">
                <p class="item-name">${item.name}</p>
                <p class="item-qtd">un: ${item.quantity}</p>
                <p class="item-price">R$ ${item.price}</p>
            </div>

            <div>
                <button class="remove-button">Remover</button>
            </div>

        </div>        
        `

        cartItems.appendChild(cartItemElement)
    })

}