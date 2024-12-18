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
// Giriş Yapma İşlemi (Login)
document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Sayfanın yeniden yüklenmesini önler
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Giriş başarılı! Token: " + data.token);
            // Token'ı saklamak için localStorage kullanılabilir
            localStorage.setItem("token", data.token);
        } else {
            alert(data.error || "Giriş yapılamadı.");
        }
    } catch (error) {
        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        console.error(error);
    }
});

// Kayıt Olma İşlemi (Register)
document.getElementById("signup-link").addEventListener("click", function() {
    const name = prompt("Adınızı girin:");
    const email = prompt("Email adresinizi girin:");
    const password = prompt("Şifrenizi girin:");

    if (name && email && password) {
        fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert("Kayıt başarılı!");
            } else {
                alert("Kayıt başarısız: " + data.error);
            }
        })
        .catch(error => {
            console.error("Kayıt sırasında hata oluştu:", error);
        });
    }
});

 // Membership linke tıklanınca modal açılır
 document.getElementById("membership-link").addEventListener("click", function () {
    document.getElementById("membership-modal").style.display = "block";
});

// Modal kapatma
document.getElementById("close-modal").addEventListener("click", function () {
    document.getElementById("membership-modal").style.display = "none";
});

// Kayıt işlemi (Sign Up)
document.getElementById("signup-link").addEventListener("click", function () {
    const name = prompt("Adınızı girin:");
    const email = prompt("Email adresinizi girin:");
    const password = prompt("Şifrenizi girin:");

    if (name && email && password) {
        fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert("Kayıt başarılı!");
                document.getElementById("membership-modal").style.display = "none";
            } else {
                alert("Kayıt başarısız: " + data.error);
            }
        })
        .catch(error => {
            console.error("Kayıt sırasında hata oluştu:", error);
        });
    }
});

// Giriş işlemi (Sign In)
document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Sayfanın yenilenmesini önler
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            alert("Giriş başarılı! Token: " + data.token);
            localStorage.setItem("token", data.token); // Token'ı saklar
            document.getElementById("membership-modal").style.display = "none";
        } else {
            alert(data.error || "Giriş yapılamadı.");
        }
    })
    .catch(error => {
        console.error("Giriş sırasında hata oluştu:", error);
    });
});
