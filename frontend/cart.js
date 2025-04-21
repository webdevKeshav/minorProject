let cart = [{
    name: "Sample Product 1",
    price: 19.99
}, {
    name: "Sample Product 2",
    price: 29.99    
}];

function addToCart(productName, productPrice) {
    // Create a cart item object
    const cartItem = {
        name: productName,
        price: productPrice
    };

    cart.push(cartItem); // Add the product to the cart
    console.log(`Product ${productName} added to cart!`);
    updateCartCount(); // Update cart count display
}

function updateCartCount() {
    const cartCount = cart.length;
    const cartBtn = document.getElementById("cartBtn");
    cartBtn.innerText = `View Cart (${cartCount})`;
}// Initialize cart

// Load cart and display items on page load
window.onload = function() {
    updateCartDisplay();
};

function updateCartDisplay() {
    const cartItemsDiv = document.getElementById("cart-items");
    const totalPriceSpan = document.getElementById("total-price");

    cartItemsDiv.innerHTML = ''; // Clear previous items
    let total = 0;

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerText = `${item.name} - $${item.price.toFixed(2)}`;
        cartItemsDiv.appendChild(itemDiv);
        total += item.price;
    });

    totalPriceSpan.innerText = total.toFixed(2);
}

document.getElementById("buyBtn").onclick = function() {
    if(cart.length === 0) {
        alert("Your cart is empty. Please add items to your cart before proceeding to checkout.");
        return;
    }
    alert("Thank you for your purchase!");
    localStorage.removeItem('cart'); // Clear the cart
    window.location.href = 'index.html'; // Redirect to home page
};