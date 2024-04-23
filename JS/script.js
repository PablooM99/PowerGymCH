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
    updateCartCount();
    const cartButton = document.querySelector('.shopping-cart button');
    if (cartButton) {
        cartButton.addEventListener('click', function() {
            toggleCartModal();
        });
    } else {
        console.error('El botón del carrito no fue encontrado en el DOM');
    }
});


    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const quantity = parseInt(button.previousElementSibling.value);
            addItemToCart(name, price, quantity);
            updateCartCount();
        });
    });

    function addItemToCart(name, price, quantity) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(item => item.name === name);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
    

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        document.getElementById('cart-count').textContent = totalCount;
    }

    function toggleCartModal() {
        const modal = document.getElementById('cart-modal');
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        } else {
            modal.style.display = 'block';
            updateModalCartDetails(); 
        }
    }
    
    

    function updateModalCartDetails() {
        const modalItems = document.getElementById('modal-cart-items');
        const modalTotal = document.getElementById('modal-cart-total');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = 0;
    
        modalItems.innerHTML = '';
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Borrar';
            removeBtn.addEventListener('click', function() {
                removeItemFromCart(index);
            });
            li.appendChild(removeBtn);
            modalItems.appendChild(li);
            total += item.price * item.quantity;
        });
    
        modalTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    function removeItemFromCart(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateModalCartDetails();
        updateCartCount();
    }
    
    function checkoutCart() {
        console.log("Función de checkout aún no implementada.");
    }
