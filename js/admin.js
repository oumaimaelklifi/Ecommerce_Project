
document.addEventListener('DOMContentLoaded', () => {
   
    loadProducts();
    updateCartCount();
    displayAdminProducts();
    
 
    document.getElementById('addProductForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addNewProduct();
    });
    

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchAdminTab(tab, tabId);
        });
    });
});

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


function showEditForm(productId, productItem) {
   
    const existingForm = document.querySelector('.edit-form');
    if (existingForm) {
        existingForm.remove();
    }
    

    const product = products.find(p => p.id === productId);
    
    if (product) {
     
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
        
        productItem.after(editForm);
        
        document.getElementById(`editForm-${productId}`).addEventListener('submit', (e) => {
            e.preventDefault();
            updateProduct(productId);
        });
        
        editForm.querySelector('.cancel-edit').addEventListener('click', () => {
            editForm.remove();
        });
    }
}


function updateProduct(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
      
        product.name = document.getElementById(`editName-${productId}`).value;
        product.price = parseFloat(document.getElementById(`editPrice-${productId}`).value);
        product.category = document.getElementById(`editCategory-${productId}`).value;
        product.stock = parseInt(document.getElementById(`editStock-${productId}`).value);
        product.description = document.getElementById(`editDescription-${productId}`).value;
        
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.name = product.name;
            cartItem.price = product.price;
            saveCart();
        }
        
     
        saveProducts();
        displayAdminProducts();
        
        alert('Produit mis à jour avec succès !');
    }
}

function addNewProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const stock = parseInt(document.getElementById('productStock').value);
    const description = document.getElementById('productDescription').value;
    

    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    
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
    
   
    displayAdminProducts();
    
 
    document.getElementById('addProductForm').reset();
    
    alert('Produit ajouté avec succès !');
}


function deleteProduct(productId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      
        products = products.filter(p => p.id !== productId);
    
        saveProducts();
      
        const cartItemIndex = cart.findIndex(item => item.id === productId);
        if (cartItemIndex !== -1) {
            cart.splice(cartItemIndex, 1);
            saveCart();
            updateCartCount();
        }
        
        
        displayAdminProducts();
        
        alert('Produit supprimé avec succès !');
    }
}


function switchAdminTab(clickedTab, tabId) {
  
    const adminTabs = document.querySelectorAll('.tab');
    adminTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
 
    const adminTabContents = document.querySelectorAll('.tab-content');
    adminTabContents.forEach(content => {
        content.classList.remove('active');
    });
    
  
    clickedTab.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}
