document.getElementById('nav-toggle').addEventListener('click', function() {
    let navMenu = document.getElementById('nav-menu');
    if (navMenu.style.display === "block") {
        navMenu.style.display = "none";
    } else {
        navMenu.style.display = "block";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggleButton = document.getElementById('dark-mode-toggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      body.classList.add('dark-mode');
    }
  
    toggleButton.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    const cartButton = document.querySelector('.shopping-cart button');
    cartButton.addEventListener('click', toggleCartModal);

    const closeButton = document.querySelector('.close-btn');
    closeButton.addEventListener('click', toggleCartModal);

    generateProductList();
    updateCartCount();
});

function generateProductList() {
    const productos = [
        { nombre: "Arroz con pescado y verduras", precio: 3500, imagen: "../media/menu/arrozconpescadoyverduras.jpg" },
        { nombre: "Ensalada mixta", precio: 1500, imagen: "../media/menu/ensalada_mixta.jpg" },
        { nombre: "Ensalada Cesar", precio: 2100, imagen: "../media/menu/ensaladaCesar.jpg" },
        { nombre: "Omelette", precio: 1300, imagen: "../media/menu/omelette.jpg" },
        { nombre: "Pollo a la plancha con verduras", precio: 3600, imagen: "../media/menu/pollo_con_verduras.jpg" },
        { nombre: "Porción tarta de acelga", precio: 1000, imagen: "../media/menu/tartadeacelga.jpg" }
    ];

    const contenedorProductos = document.querySelector('.container-menu');
    productos.forEach(producto => {
        const productoHTML = `
            <div>
                <p>${producto.nombre}</p>
                <img src="${producto.imagen}" alt="Foto de comida (${producto.nombre})">
                <p>Precio: $${producto.precio}</p>
                <input type="number" value="1" min="1" class="item-quantity">
                <button class="add-to-cart" data-name="${producto.nombre}" data-price="${producto.precio}">Agregar al carrito</button>
            </div>
        `;
        contenedorProductos.innerHTML += productoHTML;
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const quantity = parseInt(button.previousElementSibling.value);
            addItemToCart(name, price, quantity);
        });
    });
}

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
    updateModalCartDetails();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalCount;
}

function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = (modal.style.display === 'block' ? 'none' : 'block');
    updateModalCartDetails();
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
        removeBtn.addEventListener('click', () => removeItemFromCart(index));
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

document.getElementById('checkout-button').addEventListener('click', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        Swal.fire({
            title: 'Carrito Vacío',
            text: 'No tienes ítems en el carrito',
            icon: 'warning',
            confirmButtonText: 'Cerrar'
        });
    } else {
        Swal.fire({
            title: '¡Compra completada!',
            text: 'Tu compra ha sido completada exitosamente.',
            icon: 'success',
            confirmButtonText: 'Cerrar'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                updateCartCount();
                toggleCartModal();
            }
        });
    }
});
