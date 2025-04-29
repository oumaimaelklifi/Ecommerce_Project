document.addEventListener('DOMContentLoaded', () => {
    // Initialisation des fonctions
    loadProducts();
    loadCategories();
    updateCartCount();
    displayAdminProducts();
    initializeImagePreview();
    displayCategories();
    updateCategoryCount();
    populateCategoryDropdown();
  
    // Gestion du formulaire d'ajout de produit
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewProduct();
        });
    }
    
    // Gestion du formulaire d'ajout de catégorie
    const addCategoryForm = document.getElementById('addCategoryForm');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addNewCategory();
        });
    }
    
    // Gestion des onglets admin
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchAdminTab(tab, tabId);
        });
    });
    
    // Gestion des paramètres du site
    const siteSettingsForm = document.getElementById('siteSettingsForm');
    if (siteSettingsForm) {
        siteSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveSettings();
        });
    }
    
    // Gestion du filtre des commandes
    const filterOrdersBtn = document.getElementById('filterOrdersBtn');
    if (filterOrdersBtn) {
        filterOrdersBtn.addEventListener('click', () => {
            filterOrders();
        });
    }
});

// Variables globales
let categories = [];

// Fonctions pour la gestion des catégories
function loadCategories() {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
        categories = JSON.parse(savedCategories);
    } else {
        // Catégories par défaut
        categories = ['électronique', 'vêtements', 'maison'];
        saveCategories();
    }
}

function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

function updateCategoryCount() {
    const totalCategoriesElement = document.getElementById('totalCategories');
    if (totalCategoriesElement) {
        totalCategoriesElement.textContent = categories.length;
    }
}

function displayCategories() {
    const categoriesList = document.getElementById('categoriesList');
    const productCategoriesDisplay = document.getElementById('productCategoriesDisplay');
    
    if (categoriesList) {
        categoriesList.innerHTML = '';
        
        categories.forEach(category => {
            const categoryTag = document.createElement('div');
            categoryTag.className = 'category-tag';
            categoryTag.innerHTML = `
                ${escapeHtml(category)}
                <span class="delete-category" data-category="${escapeHtml(category)}">
                    <i class="fas fa-times"></i>
                </span>
            `;
            
            // Ajout de l'écouteur d'événement pour la suppression
            const deleteBtn = categoryTag.querySelector('.delete-category');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    deleteCategory(category);
                });
            }
            
            categoriesList.appendChild(categoryTag);
        });
    }
    
    if (productCategoriesDisplay) {
        productCategoriesDisplay.innerHTML = '';
        
        categories.forEach(category => {
            const categoryTag = document.createElement('div');
            categoryTag.className = 'category-tag';
            categoryTag.textContent = category;
            productCategoriesDisplay.appendChild(categoryTag);
        });
    }
}

function populateCategoryDropdown() {
    const categorySelect = document.getElementById('productCategory');
    if (!categorySelect) return;
    
    categorySelect.innerHTML = '';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function addNewCategory() {
    const newCategoryInput = document.getElementById('newCategoryName');
    if (!newCategoryInput) return;
    
    const categoryName = newCategoryInput.value.trim();
    
    if (!categoryName) {
        alert('Veuillez entrer un nom de catégorie valide');
        return;
    }
    
    // Vérification si la catégorie existe déjà
    if (categories.includes(categoryName)) {
        alert('Cette catégorie existe déjà');
        return;
    }
    
    // Ajout de la nouvelle catégorie
    categories.push(categoryName);
    saveCategories();
    
    // Mise à jour de l'affichage
    displayCategories();
    updateCategoryCount();
    populateCategoryDropdown();
    
    // Réinitialisation du formulaire
    newCategoryInput.value = '';
    
    alert('Catégorie ajoutée avec succès !');
}

function deleteCategory(categoryName) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categoryName}" ?`)) {
        // Vérification si des produits utilisent cette catégorie
        const productsUsingCategory = products.filter(p => p.category === categoryName);
        
        if (productsUsingCategory.length > 0) {
            alert(`Impossible de supprimer cette catégorie car ${productsUsingCategory.length} produit(s) l'utilisent encore.`);
            return;
        }
        
        // Suppression de la catégorie
        categories = categories.filter(c => c !== categoryName);
        saveCategories();
        
        // Mise à jour de l'affichage
        displayCategories();
        updateCategoryCount();
        populateCategoryDropdown();
        
        alert('Catégorie supprimée avec succès !');
    }
}

function displayAdminProducts() {
    const adminProductsList = document.getElementById('adminProductsList');
    if (!adminProductsList) return;
    const totalProductsElement = document.getElementById('totalProducts');
    if (totalProductsElement) {
        totalProductsElement.textContent = products.length;
    }
    
    adminProductsList.innerHTML = '';
    
    if (!products || products.length === 0) {
        adminProductsList.innerHTML = '<p>Aucun produit disponible.</p>';
        return;
    }
    
    // Création du tableau
    const table = document.createElement('table');
    table.className = 'admin-products-table';
    
    // Création de l'en-tête
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Image</th>
            <th>Produit</th>
            <th>Prix</th>
            <th>Catégorie</th>
            <th>Stock</th>
            <th>Actions</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Création du corps du tableau
    const tbody = document.createElement('tbody');
    
    products.forEach(product => {
        const imageUrl = product.image || 'placeholder.jpg';
        const stockClass = product.stock > 0 ? 'in-stock' : 'out-of-stock';
        
        const row = document.createElement('tr');
        row.dataset.id = product.id;
        row.innerHTML = `
            <td class="product-image-cell">
                <img src="${imageUrl}" alt="${product.name}" class="product-thumbnail">
            </td>
            <td class="product-name-cell">
                <strong>${product.name}</strong>
            </td>
            <td class="product-price-cell">
                ${product.price.toFixed(2)}€
            </td>
            <td class="product-category-cell">
                ${product.category}
            </td>
            <td class="product-stock-cell">
                <span class="stock-badge ${stockClass}">
                    ${product.stock}
                </span>
            </td>
            <td class="product-actions-cell">
                <button class="edit-btn" data-id="${product.id}">
                    <i class="fas fa-edit"></i> Modifier
                </button>
                <button class="delete-btn" data-id="${product.id}">
                    <i class="fas fa-trash-alt"></i> Supprimer
                </button>
            </td>
        `;
        
        // Ajout des écouteurs d'événements
        row.querySelector('.delete-btn').addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            deleteProduct(id);
        });
        
        row.querySelector('.edit-btn').addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            const productItem = e.currentTarget.closest('tr');
            showEditForm(id, productItem);
        });
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    adminProductsList.appendChild(table);
}

function showEditForm(productId, productItem) {
    const existingForm = document.querySelector('.edit-form');
    if (existingForm) {
        existingForm.remove();
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const editForm = document.createElement('div');
    editForm.className = 'edit-form show';
    
    // Création des options de catégories pour le formulaire d'édition
    let categoryOptions = '';
    categories.forEach(category => {
        categoryOptions += `<option value="${escapeHtml(category)}" ${product.category === category ? 'selected' : ''}>${escapeHtml(category)}</option>`;
    });
    
    editForm.innerHTML = `
        <form class="admin-form" id="editForm-${productId}">
            <div>
                <label for="editName-${productId}">Nom du produit</label>
                <input type="text" id="editName-${productId}" value="${escapeHtml(product.name)}" required>
            </div>
            <div>
                <label for="editPrice-${productId}">Prix (€)</label>
                <input type="number" id="editPrice-${productId}" min="0" step="0.01" value="${product.price}" required>
            </div>
            <div>
                <label for="editCategory-${productId}">Catégorie</label>
                <select id="editCategory-${productId}" required>
                    ${categoryOptions}
                </select>
            </div>
            <div>
                <label for="editStock-${productId}">Stock</label>
                <input type="number" id="editStock-${productId}" min="0" value="${product.stock}" required>
            </div>
            <div>
                <label for="editImage-${productId}">Image URL</label>
                <input type="text" id="editImage-${productId}" value="${escapeHtml(product.image || '')}" placeholder="URL de l'image">
            </div>
            <div class="image-preview-container">
                <label>Aperçu de l'image actuelle</label>
                <img id="editImagePreview-${productId}" src="${escapeHtml(product.image || 'placeholder.jpg')}" alt="Aperçu" style="max-width: 200px; max-height: 200px;">
            </div>
            <div>
                <label for="editImageFile-${productId}">Télécharger une nouvelle image</label>
                <input type="file" id="editImageFile-${productId}" accept="image/*">
            </div>
            <div style="grid-column: span 2;">
                <label for="editDescription-${productId}">Description</label>
                <textarea id="editDescription-${productId}" rows="4" required>${escapeHtml(product.description)}</textarea>
            </div>
            <button type="submit">Enregistrer les modifications</button>
            <button type="button" class="cancel-edit">Annuler</button>
        </form>
    `;
    
    productItem.after(editForm);
    
    // Gestion de l'aperçu de l'image
    const imageUrlInput = document.getElementById(`editImage-${productId}`);
    const imagePreview = document.getElementById(`editImagePreview-${productId}`);
    
    if (imageUrlInput && imagePreview) {
        imageUrlInput.addEventListener('input', () => {
            imagePreview.src = imageUrlInput.value || 'placeholder.jpg';
        });
    }
    
    // Gestion du téléchargement de fichier
    const imageFileInput = document.getElementById(`editImageFile-${productId}`);
    if (imageFileInput) {
        imageFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    imagePreview.src = event.target.result;
                    imageUrlInput.value = event.target.result;
                }
                
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }
    
    // Gestion de la soumission du formulaire
    const form = document.getElementById(`editForm-${productId}`);
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            updateProduct(productId);
        });
    }
    
    // Gestion de l'annulation
    const cancelBtn = editForm.querySelector('.cancel-edit');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            editForm.remove();
        });
    }
}

function updateProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Récupération des valeurs du formulaire
    const nameInput = document.getElementById(`editName-${productId}`);
    const priceInput = document.getElementById(`editPrice-${productId}`);
    const categoryInput = document.getElementById(`editCategory-${productId}`);
    const stockInput = document.getElementById(`editStock-${productId}`);
    const descriptionInput = document.getElementById(`editDescription-${productId}`);
    const imageInput = document.getElementById(`editImage-${productId}`);
    
    if (!nameInput || !priceInput || !categoryInput || !stockInput || !descriptionInput || !imageInput) return;
    
    // Mise à jour du produit
    product.name = nameInput.value;
    product.price = parseFloat(priceInput.value);
    product.category = categoryInput.value;
    product.stock = parseInt(stockInput.value);
    product.description = descriptionInput.value;
    product.image = imageInput.value;
    
    // Mise à jour du panier si nécessaire
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.name = product.name;
        cartItem.price = product.price;
        cartItem.image = product.image;
        saveCart();
    }
    
    // Sauvegarde et mise à jour de l'affichage
    saveProducts();
    displayAdminProducts();
    
    // Fermeture du formulaire d'édition
    const editForm = document.querySelector('.edit-form');
    if (editForm) {
        editForm.remove();
    }
    
    alert('Produit mis à jour avec succès !');
}

function addNewProduct() {
    const nameInput = document.getElementById('productName');
    const priceInput = document.getElementById('productPrice');
    const categoryInput = document.getElementById('productCategory');
    const stockInput = document.getElementById('productStock');
    const descriptionInput = document.getElementById('productDescription');
    const imageInput = document.getElementById('productImage');
    
    if (!nameInput || !priceInput || !categoryInput || !stockInput || !descriptionInput || !imageInput) return;
    
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const category = categoryInput.value;
    const stock = parseInt(stockInput.value);
    const description = descriptionInput.value.trim();
    const image = imageInput.value.trim();
    
    // Validation basique
    if (!name || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0 || !description) {
        alert('Veuillez remplir tous les champs correctement');
        return;
    }
    
    // Création du nouvel ID
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    // Création du nouveau produit
    const newProduct = {
        id: newId,
        name: name,
        price: price,
        category: category,
        description: description,
        stock: stock,
        image: image || 'placeholder.jpg'
    };
    
    // Ajout du produit
    products.push(newProduct);
    saveProducts();
    displayAdminProducts();
    
    // Réinitialisation du formulaire
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) addProductForm.reset();
    
    // Réinitialisation de l'aperçu de l'image
    const productImagePreview = document.getElementById('productImagePreview');
    if (productImagePreview) {
        productImagePreview.src = 'placeholder.jpg';
    }
    
    alert('Produit ajouté avec succès !');
}

function deleteProduct(productId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        // Suppression du produit
        products = products.filter(p => p.id !== productId);
        saveProducts();
        
        // Suppression du panier si nécessaire
        const cartItemIndex = cart.findIndex(item => item.id === productId);
        if (cartItemIndex !== -1) {
            cart.splice(cartItemIndex, 1);
            saveCart();
            updateCartCount();
        }
        
        // Mise à jour de l'affichage
        displayAdminProducts();
        alert('Produit supprimé avec succès !');
    }
}

function switchAdminTab(clickedTab, tabId) {
    // Désactivation de tous les onglets
    const adminTabs = document.querySelectorAll('.tab');
    adminTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Masquage de tous les contenus
    const adminTabContents = document.querySelectorAll('.tab-content');
    adminTabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Activation de l'onglet cliqué
    clickedTab.classList.add('active');
    const tabContent = document.getElementById(tabId);
    if (tabContent) tabContent.classList.add('active');
}

function initializeImagePreview() {
    const productImageInput = document.getElementById('productImage');
    const productImagePreview = document.getElementById('productImagePreview');
    const productImageFile = document.getElementById('productImageFile');
    
    if (!productImageInput || !productImagePreview || !productImageFile) return;
    
    // Gestion de l'URL de l'image
    productImageInput.addEventListener('input', () => {
        productImagePreview.src = productImageInput.value || 'placeholder.jpg';
    });
    
    // Gestion du téléchargement de fichier
    productImageFile.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                productImagePreview.src = event.target.result;
                productImageInput.value = event.target.result;
            }
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });
}

function filterOrders() {
    const statusFilter = document.getElementById('orderStatusFilter').value;
    const dateFilter = document.getElementById('orderDateFilter').value;
    // Implémentation de la logique de filtrage des commandes
    console.log('Filtrer les commandes par:', statusFilter, dateFilter);
    // Cette fonction serait complétée avec la logique réelle de filtrage des commandes
}

function saveSettings() {
    // Récupération des valeurs du formulaire de paramètres
    const siteName = document.getElementById('siteName').value;
    const siteDescription = document.getElementById('siteDescription').value;
    const contactEmail = document.getElementById('contactEmail').value;
    const contactPhone = document.getElementById('contactPhone').value;
    const freeShippingThreshold = document.getElementById('freeShippingThreshold').value;
    const shippingFee = document.getElementById('shippingFee').value;
    
    // Création de l'objet de paramètres
    const settings = {
        siteName,
        siteDescription,
        contactEmail,
        contactPhone,
        shipping: {
            freeThreshold: parseFloat(freeShippingThreshold),
            standardFee: parseFloat(shippingFee)
        }
    };
    
    // Sauvegarde des paramètres dans localStorage
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    
    alert('Paramètres enregistrés avec succès !');
}

// Fonction utilitaire pour échapper le HTML
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}