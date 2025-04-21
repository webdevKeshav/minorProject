// script.js
let cart = [];
// User Signup
document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, username, password }),
        });

        if (response.ok) {
            alert('User  registered successfully!');
            window.location.href = 'index.html'; // Redirect to main page
        } else {
            const error = await response.text();
            alert(`Error: ${error}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }

});

// User Login
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Store token in local storage
            alert('Login successful!');
            window.location.href = 'index.html'; // Redirect to home page
        } else {
            const error = await response.text();
            alert(`Error: ${error}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Seller Signup
document.getElementById('seller-signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const businessName = document.getElementById('business-name').value;
    const email = document.getElementById('seller-email').value;
    const password = document.getElementById('seller-password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/seller-signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ businessName, email, password }),
        });

        if (response.ok) {
            alert('Seller registered successfully!');
            window.location.href = 'index.html'; // Redirect to main page
        } else {
            const error = await response.text();
            alert(`Error: ${error}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Seller Login
document.getElementById('seller-login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('seller-email').value;
    const password = document.getElementById('seller-password').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/seller-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Store token in local storage
            alert('Seller login successful!');
            window.location.href = 'index.html'; // Redirect to home page
        } else {
            const error = await response.text();
            alert(`Error: ${error}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
// Add Product
document.getElementById('add-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const sellerId = document.getElementById('sellerId').value.trim();
    const imageFile = document.getElementById('image').files[0]; // Get the selected image file

    if (!name || !description || isNaN(price) || !sellerId || !imageFile) {
        return alert('Please fill in all fields correctly.');
    }

    const submitBtn = document.querySelector('#add-product-form button[type="submit"]');
    submitBtn.disabled = true;

    // Create a FormData object to hold the form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('sellerId', sellerId);
    formData.append('image', imageFile); // Append the image file

    try {
        const response = await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            body: formData, // Send the FormData object
        });

        if (response.ok) {
            alert('Product added successfully!');
            document.getElementById('add-product-form').reset();
        } else {
            const error = await response.json();
            console.error('Error response from server:', error);
            alert(`Error: ${error.message || 'Unable to add product'}`);
        }

        console.log('Response:', response); // For debugging
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again later.');
    } finally {
        submitBtn.disabled = false;
    }
});
// Fetch and display products on the home page

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();

        // const imgRes = await fetch('https://fakestoreapi.com/products');
        // const imgData = await imgRes.json();

        const productGrid = document.getElementById('product-grid');
        productGrid.innerHTML = ''; // Clear old content if needed

        products.forEach((product, index) => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';

            // const productImage = imgData[index % imgData.length]?.image || '';
            const productImage = `http://localhost:5000/${product.image.replace(/\\/g, '/')}`;

            productDiv.innerHTML = ` 
                <img src="${productImage}" alt="Product Image" class="product-image"/>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <button class="add-to-cart" productName="${product.name}" price="${product.price}">Add to Cart</button> 
             `;
            productGrid.appendChild(productDiv);


            //  Attach event listeners to buttons AFTER they exist in DOM
            const buttons = document.querySelectorAll('.add-to-cart');
            buttons.forEach(button => {
            button.addEventListener('click', (event) => {
            const productName = event.target.getAttribute('productName');
            const productPrice = parseFloat(event.target.getAttribute('price'));
            console.log(`Adding product ${productName} to cart`);
            addToCart(productName, productPrice);
            console.log(cart);
            });
           });
               
        });

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

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

}
