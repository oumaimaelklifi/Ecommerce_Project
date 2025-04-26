
// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Charger les produits
    loadProducts();
    
    // Mettre à jour le compteur du panier
    updateCartCount();
    
    // Afficher les produits dans la section admin
    displayAdminProducts();
    
    // Gestionnaires d'événements
    document.getElementById('addProductForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addNewProduct();
    });
    
    // Gestionnaire d'événements pour les onglets
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchAdminTab(tab, tabId);
        });
    });
});

// Afficher les produits dans la section admin
function displayAdminProducts() {
    const adminProductsList = document.getElementById('adminProductsList');
    adminProductsList.innerHTML = '';
    
    if (products.length === 0) {
        adminProductsList.innerHTML = '<p>Aucun produit disponible.</p>';
        return;
    }
    
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'admin-product-item';
        productItem.dataset.id = product.id;
        productItem.innerHTML = `
            <div class="admin-product-info">
                <strong>${product.name}</strong> - ${product.price.toFixed(2)}€ - Catégorie: ${product.category} - Stock: ${product.stock}
            </div>
            <div class="admin-actions">
                <button class="edit-btn" data-id="${product.id}">Modifier</button>
                <button class="delete-btn" data-id="${product.id}">Supprimer</button>
            </div>
        `;
        
        adminProductsList.appendChild(productItem);
        
        // Ajouter les gestionnaires d'événements
        productItem.querySelector('.delete-btn').addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            deleteProduct(id);
        });
        
        productItem.querySelector('.edit-btn').addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            showEditForm(id, productItem);
        });
    });
}

// Afficher le formulaire de modification
function showEditForm(productId, productItem) {
    // Supprimer le formulaire existant s'il y en a un
    const existingForm = document.querySelector('.edit-form');
    if (existingForm) {
        existingForm.remove();
    }
    
    // Trouver le produit
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Créer le formulaire de modification
        const editForm = document.createElement('div');
        editForm.className = 'edit-form show';
        editForm.innerHTML = `
            <form class="admin-form" id="editForm-${productId}">
                <div>
                    <label for="editName-${productId}">Nom du produit</label>
                    <input type="text" id="editName-${productId}" value="${product.name}" required>
                </div>
                <div>
                    <label for="editPrice-${productId}">Prix (€)</label>
                    <input type="number" id="editPrice-${productId}" min="0" step="0.01" value="${product.price}" required>
                </div>
                <div>
                    <label for="editCategory-${productId}">Catégorie</label>
                    <select id="editCategory-${productId}" required>
                        <option value="électronique" ${product.category === 'électronique' ? 'selected' : ''}>Électronique</option>
                        <option value="vêtements" ${product.category === 'vêtements' ? 'selected' : ''}>Vêtements</option>
                        <option value="maison" ${product.category === 'maison' ? 'selected' : ''}>Maison</option>
                    </select>
                </div>
                <div>
                    <label for="editStock-${productId}">Stock</label>
                    <input type="number" id="editStock-${productId}" min="0" value="${product.stock}" required>
                </div>
                <div style="grid-column: span 2;">
                    <label for="editDescription-${productId}">Description</label>
                    <textarea id="editDescription-${productId}" rows="4" required>${product.description}</textarea>
                </div>
                <button type="submit">Enregistrer les modifications</button>
                <button type="button" class="cancel-edit">Annuler</button>
            </form>
        `;
        
        // Ajouter le formulaire après l'élément du produit
        productItem.after(editForm);
        
        // Gestionnaire d'événement pour le formulaire
        document.getElementById(`editForm-${productId}`).addEventListener('submit', (e) => {
            e.preventDefault();
            updateProduct(productId);
        });
        
        // Gestionnaire d'événement pour le bouton d'annulation
        editForm.querySelector('.cancel-edit').addEventListener('click', () => {
            editForm.remove();
        });
    }
}

// Mettre à jour un produit
function updateProduct(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Récupérer les nouvelles valeurs
        product.name = document.getElementById(`editName-${productId}`).value;
        product.price = parseFloat(document.getElementById(`editPrice-${productId}`).value);
        product.category = document.getElementById(`editCategory-${productId}`).value;
        product.stock = parseInt(document.getElementById(`editStock-${productId}`).value);
        product.description = document.getElementById(`editDescription-${productId}`).value;
        
        // Mettre à jour le panier si le produit y est
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.name = product.name;
            cartItem.price = product.price;
            saveCart();
        }
        
        // Sauvegarder les changements
        saveProducts();
        
        // Mettre à jour l'affichage
        displayAdminProducts();
        
        alert('Produit mis à jour avec succès !');
    }
}

// Ajouter un nouveau produit
function addNewProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const stock = parseInt(document.getElementById('productStock').value);
    const description = document.getElementById('productDescription').value;
    
    // Générer un nouvel ID
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    // Créer le nouveau produit
    const newProduct = {
        id: newId,
        name: name,
        price: price,
        category: category,
        description: description,
        stock: stock
    };
    
    // Ajouter à la liste des produits
    products.push(newProduct);
    
    // Sauvegarder les changements
    saveProducts();
    
    // Mettre à jour l'affichage
    displayAdminProducts();
    
    // Réinitialiser le formulaire
    document.getElementById('addProductForm').reset();
    
    alert('Produit ajouté avec succès !');
}

// Supprimer un produit
function deleteProduct(productId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        // Supprimer le produit de la liste
        products = products.filter(p => p.id !== productId);
        
        // Sauvegarder les changements
        saveProducts();
        
        // Vérifier si le produit est dans le panier
        const cartItemIndex = cart.findIndex(item => item.id === productId);
        if (cartItemIndex !== -1) {
            cart.splice(cartItemIndex, 1);
            saveCart();
            updateCartCount();
        }
        
        // Mettre à jour l'affichage
        displayAdminProducts();
        
        alert('Produit supprimé avec succès !');
    }
}

// Changer d'onglet dans la section admin
function switchAdminTab(clickedTab, tabId) {
    // Retirer la classe active de tous les onglets
    const adminTabs = document.querySelectorAll('.tab');
    adminTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Retirer la classe active de tous les contenus d'onglet
    const adminTabContents = document.querySelectorAll('.tab-content');
    adminTabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Ajouter la classe active à l'onglet et au contenu cliqué
    clickedTab.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}
