// Manejador de eventos para el botón de navegación en dispositivos móviles
document.getElementById('nav-toggle').addEventListener('click', function() {
    let navMenu = document.getElementById('nav-menu');
    // Alternar la visibilidad del menú de navegación
    if (navMenu.style.display === "block") {
        navMenu.style.display = "none";
    } else {
        navMenu.style.display = "block";
    }
});

// Evento que se dispara cuando el contenido del DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggleButton = document.getElementById('dark-mode-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Aplicar tema oscuro si está activado y cambiar el contenido del boton dependiendo del modo que este seleccionado
    if (currentTheme === 'dark') {
      body.classList.add('dark-mode');
      toggleButton.textContent = 'Modo Claro';
    } else {
        body.classList.remove('dark-mode');
        toggleButton.textContent = 'Modo Oscuro'
    }

    // Alternar entre tema oscuro y claro
    toggleButton.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      if (body.classList.contains('dark-mode')) {
        toggleButton.textContent = 'Modo Claro'; // Cambiar a Modo Claro
        localStorage.setItem('theme', 'dark');
    } else {
        toggleButton.textContent = 'Modo Oscuro'; // Cambiar a Modo Oscuro
        localStorage.setItem('theme', 'light');
    }
    });

    // Botón del carrito y su funcionalidad
    const cartButton = document.querySelector('.shopping-cart button');
    cartButton.addEventListener('click', toggleCartModal);

    // Botón para cerrar el modal del carrito
    const closeButton = document.querySelector('.close-btn');
    closeButton.addEventListener('click', toggleCartModal);

    // Cargar productos desde un archivo JSON y actualizar el contador del carrito
    loadProducts();
    updateCartCount();
});

// Función asincrónica para cargar productos desde un archivo JSON
async function loadProducts() {
    try {
        const response = await fetch('../productos.json');
        const productos = await response.json();
        generateProductList(productos);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Generar lista de productos y mostrar en el DOM
function generateProductList(productos) {
    const contenedorProductos = document.querySelector('.container-menu');
    contenedorProductos.innerHTML = '';
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

    // Añadir manejadores de eventos a los botones de agregar al carrito
    addCartEventListeners();
}

// Añadir eventos a los botones de agregar al carrito
function addCartEventListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const quantity = parseInt(button.previousElementSibling.value);
            addItemToCart(name, price, quantity);
        });
    });
}

// Añadir ítems al carrito y guardar en localStorage
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

// Actualizar el contador de ítems en el carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalCount;
}

// Función para alternar la visibilidad del modal del carrito
function toggleCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = (modal.style.display === 'block' ? 'none' : 'block');
    updateModalCartDetails();
}

// Actualizar detalles del modal del carrito
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

// Función para eliminar ítems del carrito
function removeItemFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateModalCartDetails();
    updateCartCount();
}

function clearCartStorage() {
    // Elimina solo las claves relacionadas con el carrito de compras del localStorage
    localStorage.removeItem('cart');
    // Agregar más claves relacionados con el carrito
}

// Evento para el botón de realizar compra
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
                clearCartStorage();
                updateCartCount();
                toggleCartModal();  // Cierra el modal después de la compra
            }
        });
    }
});
