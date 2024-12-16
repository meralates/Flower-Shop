const menuOpenButton=document.querySelector("#menu-open-button");
const menuCloseButton=document.querySelector("#menu-close-button");


menuOpenButton.addEventListener("click", () =>{
    //Toggle mobile menu visibility
    document.body.classList.toggle("show-mobile-menu");


});
// Close menu when the close button is clicked
menuCloseButton.addEventListener("click", () =>menuOpenButton.click());


const sliderWrapper = document.querySelector('.slider-wrapper');
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');

let currentIndex = 0;

leftBtn.addEventListener('click', () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateSlider();
});

rightBtn.addEventListener('click', () => {
    const reviewCount = document.querySelectorAll('.review').length;
    currentIndex = Math.min(reviewCount - 1, currentIndex + 1);
    updateSlider();
});

function updateSlider() {
    const offset = currentIndex * -320; // Her bir review genişlik + margin (CSS'teki genişlik)
    sliderWrapper.style.transform = `translateX(${offset}px)`;
}


//Sepete ekleme
// Sepet verilerini tutar
const cartItems = [];

// Sepete ekleme işlevi
function addToCart(productName, productPrice) {
    // Eğer ürün zaten sepette varsa miktarını artır
    const existingItem = cartItems.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Sepete yeni ürün ekle
        cartItems.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    alert(`${productName} added to cart.`);
    updateCartUI(); // Sepet arayüzünü güncelle
}

// Modal Elements
const membershipLink = document.getElementById("membership-link");
const modal = document.getElementById("membership-modal");
const closeModal = document.getElementById("close-modal");
const signupLink = document.getElementById("signup-link");

// Open Membership Modal when clicking the Membership Button
membershipLink.addEventListener("click", function() {
    modal.style.display = "block";
});

// Close Modal when clicking on X (close button)
closeModal.addEventListener("click", function() {
    modal.style.display = "none";
});

// Close Modal when clicking outside the modal content
window.addEventListener("click", function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Switch to Sign Up form when clicking "Sign Up" link
signupLink.addEventListener("click", function() {
    document.querySelector("h2").textContent = "Sign Up";
    document.getElementById("login-btn").textContent = "Sign Up";
    document.getElementById("signup-link").style.display = "none";  // Hide sign-up link
    // You can further add logic for showing the registration form if necessary
});

// Example Sign In form submission handler
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Here you can send the data to the server or use it as needed
    localStorage.setItem("userEmail", email);  // Storing email as an example

    // Close the modal after submission
    modal.style.display = "none";
});

