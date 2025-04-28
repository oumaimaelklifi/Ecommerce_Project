
document.addEventListener('DOMContentLoaded', () => {
    // Charger les produits et le panier
    loadProducts();
    
    // Mettre à jour l'affichage du panier
    updateCartDisplay();
    updateCartCount();
    
    // Gestionnaires d'événements
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    document.getElementById('checkoutBtn').addEventListener('click', checkout);

    // Gestion "Continuer vos achats"
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => {
            window.location.href = 'index.html'; 
        });
    }
});

// Mettre à jour l'affichage du panier
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');

    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = `
        
        <tr>
            <td colspan="5" style="text-align: center; padding: 50px;">
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <h1 style="font-size: 2em; color: #333; margin-bottom: 20px;">Votre Panier</h1>
                    <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Panier vide" style="width: 80px; opacity: 0.3; margin-bottom: 20px;">
                    <h2 style="font-size: 1.5em; color: #333; margin-bottom: 10px;">Votre panier est vide</h2>
                    <p style="color: #777; margin-bottom: 30px;">Découvrez nos produits et ajoutez-les à votre panier</p>
                    <a href="index.html" style="padding: 12px 25px; background-color: #e74c3c; color: white; border-radius: 25px; text-decoration: none; font-weight: bold; transition: background 0.3s;">
                        Parcourir les produits
                    </a>
                </div>
            </td>
        </tr>
        `;

        cartTotal.textContent = '0.00';

        // ➡️ Cacher les boutons
        clearCartBtn.style.display = 'none';
        checkoutBtn.style.display = 'none';

        return;
    }

    // ➡️ Sinon, afficher les boutons
    clearCartBtn.style.display = 'inline-block';
    checkoutBtn.style.display = 'inline-block';

    let total = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;

        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement('tr');
        row.className = 'cart-item';
        row.innerHTML = `
        <table>
            <td class="item-details">
                <img src="${item.image}" alt="${item.name}" width="60" style="vertical-align:middle;">
                <div style="display:inline-block; margin-left:10px;">
                    <strong>${item.name}</strong><br>
                    <span style="background:#eee; padding:2px 8px; border-radius:10px; font-size:12px;">${item.category}</span>
                </div>
            </td>
            <td class="item-price">${item.price.toFixed(2)}€</td>
            <td class="item-quantity">
                <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
            </td>
            <td class="item-total">${itemTotal.toFixed(2)}€</td>
            <td class="item-remove">
                <span data-id="${item.id}" style="cursor:pointer; color:red; font-size:20px;">✖️</span>
            </td>
            </table>
        `;

        cartItems.appendChild(row);

        // Gestionnaires d'événements
        row.querySelector('.decrease-btn').addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            decreaseQuantity(id);
        });

        row.querySelector('.increase-btn').addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            increaseQuantity(id);
        });

        row.querySelector('.item-remove span').addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(id);
        });
    });

    cartTotal.textContent = total.toFixed(2);
}

// Diminuer la quantité d'un produit dans le panier
function decreaseQuantity(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
            
            const product = products.find(p => p.id === productId);
            if (product) {
                product.stock += 1;
            }
            
            saveCart();
            saveProducts();
            
            updateCartDisplay();
            updateCartCount();
        } else {
            removeFromCart(productId);
        }
    }
}

// Augmenter la quantité d'un produit dans le panier
function increaseQuantity(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product && product.stock > 0) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += 1;
            product.stock -= 1;
            
            saveCart();
            saveProducts();
            
            updateCartDisplay();
            updateCartCount();
        }
    } else {
        alert("Stock insuffisant pour ce produit.");
    }
}


function clearCart() {
    if (confirm("Êtes-vous sûr de vouloir vider votre panier ?")) {
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                product.stock += item.quantity;
            }
        });
        
        cart = [];
        
        saveCart();
        saveProducts();
        
        updateCartDisplay();
        updateCartCount();
    }
}

// Passer à la caisse
function checkout() {
    if (cart.length === 0) {
        alert("Votre panier est vide.");
        return;
    }
    
    alert("Merci pour votre commande ! Elle sera traitée prochainement.");
    
    cart = [];
    saveCart();
    
    updateCartDisplay();
    updateCartCount();
}


function continueShopping() {
    window.location.href = 'index.html'; 
}
