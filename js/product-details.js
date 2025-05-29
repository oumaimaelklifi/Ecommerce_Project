

document.addEventListener('DOMContentLoaded', () => {

    loadProducts();
    updateCartCount();
    

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (productId) {
        showProductDetail(productId);
    } else {
        
        window.location.href = 'index.html';
    }
});


function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    const productDetail = document.getElementById('productDetail');

    if (product) {
        productDetail.innerHTML = `
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}" style="max-width: 100%; height: auto;" />
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <div class="product-detail-price">${product.price.toFixed(2)}€</div>
                <p class="product-detail-description">${product.description}</p>
                <p class='categorie'>Catégorie: ${product.category}</p>
                <p class='categorie'>En stock: ${product.stock} unité(s)</p>
                <button class="add-to-cart-btn btn" data-id="${product.id}">Ajouter au panier</button>
            </div>
        `;

        productDetail.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            addToCart(id);
        });

        document.title = `${product.name} - E-Boutique`;

        const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

        if (relatedProducts.length > 0) {
            const relatedHTML = relatedProducts.map(p => `
              
                <div class="related-product">
                    <img src="${p.image}" alt="${p.name}" " />
                    <p>${p.name}</p>
                    <p>${p.price.toFixed(2)}€</p>
                    
                </div>
            `).join('');

            const relatedContainer = document.createElement('div');
            relatedContainer.innerHTML = `<h3 class='relted-titre'>Produits similaires</h3><div class="related-products">${relatedHTML}</div>`;
            productDetail.appendChild(relatedContainer);
        }

    } else {
        productDetail.innerHTML = `
            <div class="product-detail-info">
                <h2>Produit non trouvé</h2>
                <p>Le produit demandé n'existe pas ou a été supprimé.</p>
            </div>
        `;
    }
}
