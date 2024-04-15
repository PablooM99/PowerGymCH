document.getElementById('nav-toggle').addEventListener('click', function() {
    let navMenu = document.getElementById('nav-menu');
    if (navMenu.style.display === "block") {
        navMenu.style.display = "none";
    } else {
        navMenu.style.display = "block";
    }
});

// funciones para el modo oscuro

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggleButton = document.getElementById('dark-mode-toggle');
  
    // Cargar el tema desde localStorage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      body.classList.add('dark-mode');
    }
  
    // Alternar el tema y almacenarlo en localStorage
    toggleButton.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
  });
  
// función para el carrito de compras

document.addEventListener('DOMContentLoaded', () => {
    const cart = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');

    // Función para añadir producto al carrito
    function addToCart(product, quantity) {
        let found = false;
        cart.querySelectorAll('li').forEach(item => {
            if (item.dataset.name === product.name) {
                let newQuantity = parseInt(item.dataset.quantity) + parseInt(quantity);
                item.textContent = `${product.name} - $${product.price} x ${newQuantity}`;
                item.dataset.quantity = newQuantity.toString();
                found = true;
            }
            updateCartCount();
        });

        function updateCartCount() {
            let total = 0;
            cart.querySelectorAll('li').forEach(item => {
                total += parseInt(item.dataset.quantity);
            });
            cartCount.textContent = total;
        }

        if (!found) {
            const li = document.createElement('li');
            li.textContent = `${product.name} - ${product.price} x ${quantity}`;
            li.dataset.name = product.name;
            li.dataset.quantity = quantity.toString();
            cart.appendChild(li);
        }

        saveCart();
    }

    // Cargar el carrito desde localStorage y agregar evento de click a botones de añadir
    function loadCartAndBindAddToCartButtons() {
        const savedCart = JSON.parse(localStorage.getItem('cart'));
        if (savedCart) {
            savedCart.forEach(item => addToCart(item, item.quantity));
        }

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const product = {
                    name: button.getAttribute('data-name'),
                    price: button.getAttribute('data-price')
                };
                const quantityInput = button.previousElementSibling;
                const quantity = quantityInput.value;
                addToCart(product, quantity);
            });
        });
    }

    // Guardar el carrito en localStorage
    function saveCart() {
        const cartItems = cart.querySelectorAll('li');
        const cartArray = [];
        cartItems.forEach(item => {
            cartArray.push({ 
                name: item.dataset.name, 
                price: parseInt(item.textContent.match(/\$(\d+)/)[1]), 
                quantity: parseInt(item.dataset.quantity)
            });
        });
        localStorage.setItem('cart', JSON.stringify(cartArray));
    }

    loadCartAndBindAddToCartButtons();
});

  // Codigo para mostrar u ocultar la ventana emergente del carrito de compras

  document.getElementById('shopping-cart').addEventListener('click', () => {
    const modal = document.getElementById('shopping-cart-modal');
    modal.style.display = 'block';
    updateCartDetails();
});

function updateCartDetails() {
    const cartDetails = document.getElementById('cart-details');
    const cartTotal = document.getElementById('cart-total');

}
