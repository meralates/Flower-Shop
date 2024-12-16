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

/*// Sepeti güncelle ve toplam fiyatı hesapla
function updateCartUI() {
    const cartContainer = document.querySelector("#cart-container"); // Sepet alanı
    const totalPriceElement = document.querySelector("#total-price"); // Toplam fiyat alanı

    // Sepeti temizle
    cartContainer.innerHTML = "";
    let totalPrice = 0;

    // Sepetteki ürünleri listele
    cartItems.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.innerHTML = `${item.name} - ${item.price} $ x ${item.quantity}`;
        cartContainer.appendChild(itemElement);

        totalPrice += item.price * item.quantity; // Toplam fiyatı hesapla
    });

    // Toplam fiyatı güncelle
    totalPriceElement.textContent = `Total: ${totalPrice} $`;
}

// Siparişi tamamla işlevi
function completeOrder() {
    if (cartItems.length === 0) {
        alert("The cart is empty, Please add product!");
        return;
    }

    let orderSummary = "Order details:\n";
    cartItems.forEach(item => {
        orderSummary += `${item.name} - ${item.quantity} adet\n`;
    });

    alert(`${orderSummary}\ Your order has been received, Thank you!`);

    // Sepeti temizle
    cartItems.length = 0;
    updateCartUI();
}

// Olay dinleyicileri ekle
const addToCartButtons = document.querySelectorAll(".add-to-cart");
addToCartButtons.forEach(button => {
    button.addEventListener("click", () => {
        const productName = button.dataset.name;
        const productPrice = parseFloat(button.dataset.price);
        addToCart(productName, productPrice);
    });
});

const completeOrderButton = document.querySelector("#complete-order");
completeOrderButton.addEventListener("click", completeOrder);

*/



