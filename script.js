document.addEventListener("DOMContentLoaded", () => {
    /* -------------------- Navbar Mobile Menu -------------------- */
    const menuOpenButton = document.querySelector("#menu-open-button");
    const menuCloseButton = document.querySelector("#menu-close-button");
  
    menuOpenButton.addEventListener("click", () => {
      document.body.classList.toggle("show-mobile-menu");
    });
  
    menuCloseButton.addEventListener("click", () => {
      document.body.classList.remove("show-mobile-menu");
    });
  
    /* -------------------- Reviews Slider -------------------- */
    const sliderWrapper = document.querySelector(".slider-wrapper");
    const leftBtn = document.querySelector(".left-btn");
    const rightBtn = document.querySelector(".right-btn");
  
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
      const offset = currentIndex * -320; // Her bir review genişlik + margin (CSS'teki genişlik)
      sliderWrapper.style.transform = `translateX(${offset}px)`;
    }
  
    /* -------------------- Cart Functionality -------------------- */
    let cartItems = [];
  
    function addToCart(productName, productPrice) {
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
    }
  
    function updateCartUI() {
      const cartContainer = document.getElementById("cart-container");
      cartContainer.innerHTML = "";
      let total = 0;
  
      cartItems.forEach((item) => {
        const div = document.createElement("div");
        div.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
        cartContainer.appendChild(div);
        total += item.price * item.quantity;
      });
  
      document.getElementById("total-price").textContent = `Total: $${total}`;
      document.getElementById("cart-count").textContent = `Cart (${cartItems.length})`;
    }
  
    /* -------------------- Membership Modals -------------------- */
    const signinModal = document.getElementById("signin-modal");
    const signupModal = document.getElementById("signup-modal");
    const closeSigninModal = document.getElementById("close-signin-modal");
    const closeSignupModal = document.getElementById("close-signup-modal");
  
    // Open Sign In Modal
    document.getElementById("membership-link").addEventListener("click", () => {
      signinModal.classList.remove("hidden");
    });
  
    // Close Modals
    closeSigninModal.addEventListener("click", () => {
      signinModal.classList.add("hidden");
    });
  
    closeSignupModal.addEventListener("click", () => {
      signupModal.classList.add("hidden");
    });
  
    // Switch to Sign Up Modal
    document.getElementById("open-signup-modal").addEventListener("click", () => {
      signinModal.classList.add("hidden");
      signupModal.classList.remove("hidden");
    });
  
    // Sign Up Form
    document.getElementById("signup-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const firstName = document.getElementById("signup-firstname").value;
      const lastName = document.getElementById("signup-lastname").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;
  
      fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            alert("Sign up successful!");
            signupModal.classList.add("hidden");
          } else {
            alert("Sign up failed: " + data.error);
          }
        })
        .catch((err) => console.error("Sign up error:", err));
    });
  
    // Sign In Form
    document.getElementById("signin-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("signin-email").value;
      const password = document.getElementById("signin-password").value;
  
      fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userName", `${data.firstName} ${data.lastName}`);
            alert("Sign in successful!");
            updateMembershipName();
            signinModal.classList.add("hidden");
          } else {
            alert("Sign in failed: " + data.error);
          }
        })
        .catch((err) => console.error("Sign in error:", err));
    });
  
    /* -------------------- Update Membership Name -------------------- */
    function updateMembershipName() {
      const userName = localStorage.getItem("userName");
      if (userName) {
        const membershipText = document.getElementById("membership-link");
        membershipText.innerHTML = `<i class="fas fa-user"></i> ${userName}`;
      }
    }
  
    // Initialize Membership Name on Page Load
    updateMembershipName();
  });
  