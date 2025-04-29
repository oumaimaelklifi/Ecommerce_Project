let defaultProducts = [
   
        {
            id: 1,
            name: "Smartphone XYZ",
            price: 599.99,
            category: "Électronique",
            image: "../Assets/iphon.jpg",
            description: "Un smartphone haut de gamme avec d'excellentes performances.",
            stock:40,

        },
        {
            id: 2,
            name: "Laptop Pro",
            price: 999.99,
            category: "Électronique",
            image: "../Assets/laptop.jpg",
            stock:50,
            description: "Ordinateur portable puissant pour les professionnels."
        },
        {
            id: 3,
            name: "T-shirt Premium",
            price: 29.99,
            category: "Vêtements",
            image: "../assets/f6.jpg",
            stock:90,
            description: "T-shirt confortable en coton bio."
        },
        {
            id: 4,
            name: "Jean Classique",
            price: 49.99,
            category: "Vêtements",
            image: "../Assets/f5.jpg",
            stock:400,
            description: "Jean durable de qualité supérieure."
        },
        {
            id: 15,
            name: "Jean Classique",
            price: 49.99,
            category: "Vêtements",
            image: "../Assets/f7.jpg",
            stock:400,
            description: "Jean durable de qualité supérieure."
        },
        {
            id: 5,
            name: "Roman Bestseller",
            price: 19.99,
            category: "Livres",
            image: "   ../Assets/livre2.jpeg",
            stock:20,
            description: "Le dernier roman à succès qui captivera votre attention."
        },
        {
            id: 6,
            name: "laila",
            price: 19.99,
            category: "Livres",
            image: "../Assets/livre3.jpeg",
            stock:40,
            description: "Le dernier roman à succès qui captivera votre attention."
        },
        {
            id: 7,
            name: "Guide Pratique",
            price: 24.99,
            category: "Livres",
            stock:90,
            image: "../Assets/livre1.jpeg",
            description: "Un guide pratique pour améliorer votre quotidien."
        },
        {
            id: 8,
            name: "Lampe Design",
            price: 79.99,
            category: "Maison",
            image: "../Assets/doc3.jpg",
            stock:70,
            description: "Lampe élégante pour une ambiance chaleureuse."
        },
        {
            id: 9,
            name: "Tapis Moderne",
            price: 129.99,
            category: "Maison",
            image: "../Assets/doc2.jpg",
            stock:400,
            description: "Tapis moderne qui s'intègre parfaitement à votre intérieur."
        },
        {
            id: 10,
            name: "Écouteurs Sans Fil",
            price: 149.99,
            category: "Électronique",
            image: "../Assets/ecouteir.jpg",
            stock:10,
            description: "Écouteurs sans fil avec une excellente qualité sonore."
        },
        {
            id: 11,
            name: "Vase Décoratif",
            price: 39.99,
            category: "Maison",
            image: "../assets/deco2.jpg",
            stock:290,
            description: "Vase élégant pour mettre en valeur vos fleurs."
        },
        {
            id: 12,
            name: "Montre Connectée",
            price: 199.99,
            category: "Électronique",
            image: "../Assets/montre.jpg",
            stock:40,
            description: "Montre connectée avec de nombreuses fonctionnalités."
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
