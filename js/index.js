
document.addEventListener('DOMContentLoaded', () => {

    loadProducts();
    displayProducts(products);
    updateCartCount();
    
 
    document.getElementById('filterBtn').addEventListener('click', filterProducts);
});


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
        
       
        const imgElement = document.createElement('img');
        imgElement.alt = product.name;
        imgElement.src = product.image;
        imgElement.onerror = function() {
            console.error(`Impossible de charger l'image: ${product.image}`);
            this.src = './images/placeholder.png';
            this.onerror = null;
        };

        const imgContainer = document.createElement('div');
        imgContainer.className = 'product-image';
        imgContainer.style.position = 'relative'; 
        
        const descriptionElement = document.createElement('div');
        descriptionElement.className = 'product-description';
        descriptionElement.textContent = product.description;
        
     
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

// Fonction pour charger dynamiquement les catégories dans le filtre
function loadCategoryOptions() {
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Créer une option vide par défaut
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Toutes les catégories';
    categoryFilter.appendChild(defaultOption);
    
  
    const categories = [...new Set(products.map(product => product.category))];
    
 
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}


window.addEventListener('DOMContentLoaded', function() {
    loadCategoryOptions();

    displayProducts(products);
});


function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    
    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                             product.description.toLowerCase().includes(searchTerm);
        
        const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
        
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