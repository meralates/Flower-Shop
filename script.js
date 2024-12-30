document.addEventListener("DOMContentLoaded", () => {
  /* -------------------- Navbar Mobile Menu -------------------- */
  const menuOpenButton = document.querySelector("#menu-open-button");
  const menuCloseButton = document.querySelector("#menu-close-button");

  if (menuOpenButton && menuCloseButton) {
    menuOpenButton.addEventListener("click", () => {
      document.body.classList.toggle("show-mobile-menu");
    });

    menuCloseButton.addEventListener("click", () => {
      document.body.classList.remove("show-mobile-menu");
    });
  }

  /* -------------------- Reviews Slider -------------------- */
  const sliderWrapper = document.querySelector(".slider-wrapper");
  const leftBtn = document.querySelector(".left-btn");
  const rightBtn = document.querySelector(".right-btn");

  if (sliderWrapper && leftBtn && rightBtn) {
    let currentIndex = 0;

    leftBtn.addEventListener("click", () => {
      currentIndex = Math.max(0, currentIndex - 1);
      updateSlider();
    });

    rightBtn.addEventListener("click", () => {
      const reviewCount = document.querySelectorAll(".review").length;
      currentIndex = Math.min(reviewCount - 1, currentIndex + 1);
      updateSlider();
    });

    function updateSlider() {
      const offset = currentIndex * -320; // Adjust based on your CSS width and margin
      sliderWrapper.style.transform = `translateX(${offset}px)`;
    }
  }

  /* -------------------- Cart Functionality -------------------- */
  let cartItems = [];

  window.addToCart = function (productName, productPrice) {
    const existingItem = cartItems.find((item) => item.name === productName);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        name: productName,
        price: productPrice,
        quantity: 1,
      });
    }

    alert(`${productName} added to cart.`);
    updateCartUI();
  };

  function updateCartUI() {
    const cartContainer = document.getElementById("cart-container");
    const totalPriceElement = document.getElementById("total-price");
    const cartCountElement = document.getElementById("cart-count");

    if (!cartContainer || !totalPriceElement || !cartCountElement) return;

    cartContainer.innerHTML = "";
    let total = 0;

    cartItems.forEach((item) => {
      const div = document.createElement("div");
      div.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
      cartContainer.appendChild(div);
      total += item.price * item.quantity;
    });

    totalPriceElement.textContent = `Total: $${total}`;
    cartCountElement.textContent = `Cart (${cartItems.length})`;
  }

 /* -------------------- Membership Modals -------------------- */
const signinModal = document.getElementById("signin-modal");
const signupModal = document.getElementById("signup-modal");
const closeSigninModal = document.getElementById("close-signin-modal");
const closeSignupModal = document.getElementById("close-signup-modal");
const membershipLink = document.getElementById("membership-link");

if (membershipLink && signinModal && closeSigninModal && closeSignupModal) {
  membershipLink.addEventListener("click", () => {
    signinModal.classList.remove("hidden");
  });

  closeSigninModal.addEventListener("click", () => {
    signinModal.classList.add("hidden");
  });

  closeSignupModal.addEventListener("click", () => {
    signupModal.classList.add("hidden");
  });

  document.getElementById("open-signup-modal").addEventListener("click", () => {
    signinModal.classList.add("hidden");
    signupModal.classList.remove("hidden");
  });
}

/* -------------------- Sign Up Form -------------------- */
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const firstName = document.getElementById("signup-firstname").value;
    const lastName = document.getElementById("signup-lastname").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Kayıt başarılı!");
        signupModal.classList.add("hidden");
      } else {
        alert(`Hata: ${data.error}`);
      }
    } catch (error) {
      console.error("Kayıt sırasında hata:", error);
      alert("Kayıt sırasında bir hata oluştu.");
    }
  });
}

/* -------------------- Sign In Form -------------------- */
const signinForm = document.getElementById("signin-form");
if (signinForm) {
  signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signin-email").value;
    const password = document.getElementById("signin-password").value;

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", `${data.user.firstName} ${data.user.lastName}`);
        alert("Giriş başarılı!");

        updateMembershipName();
        signinModal.classList.add("hidden");
      } else {
        alert(`Hata: ${data.error}`);
      }
    } catch (error) {
      console.error("Giriş sırasında hata:", error);
      alert("Giriş sırasında bir hata oluştu.");
    }
  });
}

/* -------------------- Update Membership Name -------------------- */
function updateMembershipName() {
  const userName = localStorage.getItem("userName");
  const membershipText = document.getElementById("membership-text");

  if (userName && membershipText) {
    membershipText.textContent = userName;
  }
}

updateMembershipName();


  /* -------------------- Load Categories -------------------- */
 // Kategorileri Al ve Göster
 async function fetchCategories() {
  try {
    const response = await fetch('http://localhost:3000/categories');
    const categories = await response.json();

    displayCategories(categories);
  } catch (error) {
    console.error('Kategoriler alınırken hata oluştu:', error);
  }
}

function displayCategories(categories) {
  const categoryList = document.getElementById('category-list');
  categoryList.innerHTML = '';

  categories.forEach((category) => {
    const categoryButton = document.createElement('button');
    categoryButton.textContent = category.name;
    categoryButton.onclick = () => fetchProducts(category.id); // Tıklanan kategoriye göre ürün getir

    categoryList.appendChild(categoryButton);
  });
}

// Sayfa yüklendiğinde kategorileri al
document.addEventListener('DOMContentLoaded', fetchCategories);


// Ürünleri Al ve Göster
// Sunucudan ürünleri al
async function fetchProducts(categoryId) {
  try {
    const response = await fetch(`http://localhost:3000/products/${categoryId}`); // Kategori ID'yi buraya geçiyoruz
    const products = await response.json();

    // Ürünleri göster
    displayProducts(products);
  } catch (error) {
    console.error('Ürünler alınırken hata oluştu:', error);
  }
}

// Ürünleri DOM'a ekle
function displayProducts(products) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = ''; // Önce mevcut içerikleri temizle

  products.forEach((product) => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product'); // CSS için product sınıfı ekle

    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <span>$${product.price}</span>
    `;

    productList.appendChild(productDiv);
  });
}

// Sayfa yüklendiğinde varsayılan kategori ürünlerini getir
document.addEventListener('DOMContentLoaded', () => {
  const defaultCategoryId = 1; // Varsayılan kategori ID
  fetchProducts(defaultCategoryId);
});


// Sayfa Yüklenince Kategorileri Çek
window.onload = fetchCategories;

});


