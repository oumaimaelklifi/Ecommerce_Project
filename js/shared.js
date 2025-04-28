let defaultProducts = [
    {
        id: 1,
        name: "Smartphone XYZ",
        price: 299.99,
        category: "électronique",
        description: "Smartphone performant avec écran HD, 128Go de stockage et batterie longue durée.",
        stock: 15,
        image: "../Assets/ecouteir.jpg", 
    },
    {
        id: 2,
        name: "Laptop Pro",
        price: 899.99,
        category: "électronique",
        description: "Ordinateur portable puissant avec processeur i7, 16Go de RAM, SSD 512Go.",
        stock: 8,
        image: "../Assets/laptop.jpg", 
    },
    {
        id: 3,
        name: "T-shirt en coton",
        price: 199,
        category: "vêtements",
        description: "T-shirt confortable en coton bio, disponible en plusieurs coloris.",
        stock: 50,
        image: "../Assets/f5.jpg",  
    },
    {
        id: 4,
        name: "Vase design",
        price: 459,
        category: "maison",
        description: "Vase moderne en céramique, idéal pour votre décoration intérieure.",
        stock: 12,
        image: "../Assets/doc2.jpg",  
    },
    {
        id: 5,
        name: "Écouteurs sans fil",
        price: 120.99,
        category: "électronique",
        description: "Écouteurs Bluetooth avec réduction de bruit active et autonomie de 24h.",
        stock: 25,
        image: "../Assets/ecouteir.jpg",  
    },
    {
        id: 6,
        name: "Écouteurs sans fil modèle 2",
        price: 200.99,
        category: "électronique",
        description: "Écouteurs Bluetooth performants avec réduction de bruit et grande autonomie.",
        stock: 20,
        image: "../Assets/f3.jpg",  
    },
    {
        id: 7,
        name: "Écouteurs sans fil modèle 3",
        price: 300.99,
        category: "électronique",
        description: "Écouteurs haut de gamme avec son cristallin et réduction de bruit active.",
        stock: 20,
        image: "../Assets/f4.jpg", 
    },
];


let products = [];
let cart = [];


function loadProducts() {
    const savedProducts = localStorage.getItem('e-boutique-products');
    
    try {
        if (savedProducts) {
            // Essayer de charger les produits du localStorage
            const parsedProducts = JSON.parse(savedProducts);
            console.log("Produits chargés depuis localStorage:", parsedProducts);
            
           
            const productsWithValidImages = parsedProducts.map(product => {
                if (!product.image) {
                    console.warn(`Produit sans image: ${product.name} (ID: ${product.id})`);
                 
                    product.image = './images/no-image.png';
                }
                return product;
            });
            
            products = productsWithValidImages;
        } else {
            console.log("Aucun produit dans localStorage, utilisation des produits par défaut");
            products = defaultProducts;
       
            products.forEach(product => {
                if (!product.image) {
                    product.image = './images/no-image.png';
                }
            });
            saveProducts();
        }
    } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
      
        products = defaultProducts;
   
        localStorage.removeItem('e-boutique-products');
        saveProducts();
    }
  
    loadCart();
    

    console.log("Produits chargés:", products);
}


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


function saveCart() {
    localStorage.setItem('e-boutique-cart', JSON.stringify(cart));
}


function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product && product.stock > 0) {
      
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
        
        product.stock -= 1;
        
        saveCart();
        saveProducts();
    
        updateCartCount();
        
        alert(`${product.name} ajouté au panier !`);
    } else {
        alert("Ce produit n'est plus en stock.");
    }
}

function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        
   
        const product = products.find(p => p.id === productId);
        if (product) {
            product.stock += item.quantity;
            saveProducts();
        }
     
        cart.splice(itemIndex, 1);
        saveCart();
        
        updateCartCount();
        
        if (window.location.href.includes('cart.html')) {
            updateCartDisplay();
        }
    }
}

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
