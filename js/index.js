
// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Charger les produits du localStorage ou utiliser les produits par défaut
    loadProducts();
    
    // Afficher les produits
    displayProducts(products);
    
    // Mettre à jour le compteur du panier
    updateCartCount();
    
    // Gestionnaires d'événements
    document.getElementById('filterBtn').addEventListener('click', filterProducts);
});

// Afficher les produits dans la grille
function displayProducts(productsToDisplay) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p>Aucun produit ne correspond à votre recherche.</p>';
        return;
    }
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Créer l'élément image
        const imgElement = document.createElement('img');
        imgElement.alt = product.name;
        imgElement.src = product.image;
        imgElement.onerror = function() {
            console.error(`Impossible de charger l'image: ${product.image}`);
            this.src = './images/placeholder.png';
            this.onerror = null;
        };

        // Conteneur pour l'image + description
        const imgContainer = document.createElement('div');
        imgContainer.className = 'product-image';
        imgContainer.style.position = 'relative'; // important
        
        // Description cachée
        const descriptionElement = document.createElement('div');
        descriptionElement.className = 'product-description';
        descriptionElement.textContent = product.description;
        
        // On ajoute image + description dans imgContainer
        imgContainer.appendChild(imgElement);
        imgContainer.appendChild(descriptionElement);
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'product-info';
        infoDiv.innerHTML = `
           
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">${product.price.toFixed(2)}€</div>
            <div class="product-actions">
                <a href="product-details.html?id=${product.id}">
                    <button class="view-btn">Voir détails</button>
                </a>
                <button class="add-to-cart-btn" data-id="${product.id}">Ajouter au panier</button>
            </div>
        `;
        
        productCard.appendChild(imgContainer);
        productCard.appendChild(infoDiv);
        productsGrid.appendChild(productCard);
        
        productCard.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}


// Filtrer les produits
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    
    let filteredProducts = products.filter(product => {
        // Filtrer par terme de recherche
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                             product.description.toLowerCase().includes(searchTerm);
        
        // Filtrer par catégorie
        const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
        
        // Filtrer par prix
        let matchesPrice = true;
        if (priceFilter === '0-50') {
            matchesPrice = product.price <= 50;
        } else if (priceFilter === '50-100') {
            matchesPrice = product.price > 50 && product.price <= 100;
        } else if (priceFilter === '100+') {
            matchesPrice = product.price > 100;
        }
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    displayProducts(filteredProducts);
}
