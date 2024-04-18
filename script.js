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

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCart();
    cartModal.style.display = "flex";
});

// Fechar o modal do carrinho clicando fora dele
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none";
    }
});

// Fechar o modal clicando no botão de fechar
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none";
});

// Adicionar item ao carrinho ao clicar no menu
menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".btncar");
    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

// Função para adicionar item ao carrinho
function addToCart(name, price){
    const existItem = cart.find(item => item.name === name);

    if(existItem){
        existItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1,
        });
    }

    updateCart();
}

// Atualiza o carrinho
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

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCounter.innerHTML = totalItems;
}

// Função para remover item do carrinho
cartItems.addEventListener("click", function (event) {
    if(event.target.classList.contains("remove-button")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCart();
            return;
        }

        cart.splice(index, 1);
        updateCart();
    }
}


checkoutBtn.addEventListener("click", function() {
    
    
    //verificar se a loja está aberta
    if (cart.length === 0) return; 
    if (addressInput.value === "") {
        addressWarn.style.display = "block";
        return;
    } else {
        addressWarn.style.display = "none"; 
       
        // Coloque aqui o código para finalizar o pedido se o endereço estiver preenchido
        
    }

    //verificar se a loja está aberta
    const isOpen = checkOpenClose();
    if(!isOpen) {
        Toastify({
            text: "Olá, no momento estamos fechados!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ff0000"
            },
            onClick: function(){} // Callback after click
          }).showToast();
        return;
    }

    //verificar se há items no carrinho
    if (cart.length === 0) return;


    //enviar o pedido para api WhatsApp
    const cartItemsText = cart.map((item) => {
        return (
            `${item.name} - Quantidade:(${item.quantity}) - Preço: R$${item.price} | `
        )
    }).join("")

    //console.log("Items: " + cartItemsText);

    const message = encodeURIComponent(cartItemsText)
    const phone = "5562981989026"
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCart();
   
    
})

// Verificar se a loja está aberta ou fechada
function checkOpenClose() {
    const data = new Date();
    const hour = data.getHours();
    return hour >= 17 && hour < 23;
}

// Atualizar a cor do span de acordo com o status de abertura da loja
const isOpen = checkOpenClose();
spanItem.style.backgroundColor = isOpen ? "#1cce1ccd" : "#ff0000b0";
spanItem.style.borderRadius = "3px";

// Atualizar aviso de endereço conforme o usuário digita
addressInput.addEventListener("input", function(event) {
    let inputValue = event.target.value;
    addressWarn.style.display = inputValue.length > 0 ? "none" : "block";
});

// Finalizar pedido

