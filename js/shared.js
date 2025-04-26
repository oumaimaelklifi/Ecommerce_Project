// Base de données des produits par défaut
let defaultProducts = [
    {
        id: 1,
        name: "Smartphone XYZ",
        price: 299.99,
        category: "électronique",
        description: "Un smartphone performant avec un écran HD, 128Go de stockage et une batterie longue durée.",
        stock: 15,
        image: '../Assets/ecouteir.jpg', 
    },
    {
        id: 2,
        name: "Laptop Pro",
        price: 899.99,
        category: "électronique",
        description: "Ordinateur portable puissant avec processeur i7, 16Go RAM et SSD 512Go.\nÉcouteurs Bluetooth avec réduction de bruit active et autonomie de 24h",
        stock: 8,
        image: "../Assets/laptop.jpg", 
    },
    {
        id: 3,
        name: "T-shirt coton ",
        price: 199,
        category: "vêtements",
        description: "T-shirt confortable en coton bio, disponible en plusieurs coloris.\nT-shirt confortable en coton bio, disponible en plusieurs coloris.",
        stock: 50,
        image: "../Assets/f5.jpg",  // Assurez-vous que cette image existe dans le bon dossier
    },
    {
        id: 4,
        name: "Vase design",
        price: 459,
        category: "maison",
        description: "Vase moderne en céramique, parfait pour votre décoration intérieure.",
        stock: 12,
        image:"../Assets/doc2.jpg",  // Assurez-vous que cette image existe dans le bon dossier
    },
    {
        id: 5,
        name: "Écouteurs sans fil",
        price: 120.99,
        category: "électronique",
        description: "Écouteurs Bluetooth avec réduction de bruit active et autonomie de 24h.",
        stock: 25,
        image: "../Assets/ecouteir.jpg",  // Assurez-vous que cette image existe dans le bon dossier
    },
    {
        id: 6,
        name: "Écouteurs sans fils",
        price: 200.99,
        category: "électronique",
        description: "Écouteurs Bluetooth avec réduction de bruit active et autonomie de 24h.",
        stock: 20,
        image: "../Assets/f3.jpg",  // Assurez-vous que cette image existe dans le bon dossier
    },
    {
        id: 7,
        name: "Écouteurs sans fils",
        price: 300.99,
        category: "électronique",
        description: "Écouteurs Bluetooth avec réduction de bruit active et autonomie de 24h.",
        stock: 20,
        image: "../Assets/f4.jpg",  // Assurez-vous que cette image existe dans le bon dossier
    },
    
];


// Variables globales pour les produits et le panier
let products = [];
let cart = [];

// Charger les produits du localStorage ou utiliser les produits par défaut
function loadProducts() {
    const savedProducts = localStorage.getItem('e-boutique-products');
    
    try {
        if (savedProducts) {
            // Essayer de charger les produits du localStorage
            const parsedProducts = JSON.parse(savedProducts);
            console.log("Produits chargés depuis localStorage:", parsedProducts);
            
            // Vérifier si les produits ont des images valides
            const productsWithValidImages = parsedProducts.map(product => {
                if (!product.image) {
                    console.warn(`Produit sans image: ${product.name} (ID: ${product.id})`);
                    // Assigner une image par défaut
                    product.image = './images/no-image.png';
                }
                return product;
            });
            
            products = productsWithValidImages;
        } else {
            console.log("Aucun produit dans localStorage, utilisation des produits par défaut");
            products = defaultProducts;
            // S'assurer que tous les produits par défaut ont des images valides
            products.forEach(product => {
                if (!product.image) {
                    product.image = './images/no-image.png';
                }
            });
            saveProducts();
        }
    } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
        // En cas d'erreur, réinitialiser avec les produits par défaut
        products = defaultProducts;
        // Supprimer les données corrompues du localStorage
        localStorage.removeItem('e-boutique-products');
        saveProducts();
    }
    
    // Charger le panier
    loadCart();
    
    // Afficher les informations sur les produits chargés
    console.log("Produits chargés:", products);
}

// Sauvegarder les produits dans le localStorage
function saveProducts() {
    localStorage.setItem('e-boutique-products', JSON.stringify(products));
}

// Charger le panier du localStorage
function loadCart() {
    const savedCart = localStorage.getItem('e-boutique-cart');
    
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Sauvegarder le panier dans le localStorage
function saveCart() {
    localStorage.setItem('e-boutique-cart', JSON.stringify(cart));
}

// Ajouter un produit au panier
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product && product.stock > 0) {
        // Vérifier si le produit est déjà dans le panier
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        // Mettre à jour le stock
        product.stock -= 1;
        
        // Sauvegarder les changements
        saveCart();
        saveProducts();
        
        // Mettre à jour l'affichage du compteur du panier
        updateCartCount();
        
        alert(`${product.name} ajouté au panier !`);
    } else {
        alert("Ce produit n'est plus en stock.");
    }
}

// Supprimer un élément du panier
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        
        // Remettre en stock
        const product = products.find(p => p.id === productId);
        if (product) {
            product.stock += item.quantity;
            saveProducts();
        }
        
        // Supprimer du panier
        cart.splice(itemIndex, 1);
        saveCart();
        
        // Mettre à jour l'affichage
        updateCartCount();
        
        // Si nous sommes sur la page du panier, mettre à jour l'affichage du panier
        if (window.location.href.includes('cart.html')) {
            updateCartDisplay();
        }
    }
}

// Mettre à jour le compteur du panier
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}





window.addEventListener('load', function() {
    const links = document.querySelectorAll('nav ul li a');
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });
});
