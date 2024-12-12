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
const cart = [];

function addToCart(productName, productPrice) {
    cart.push({ name: productName, price: productPrice });
    alert(`${productName} has been added to your cart.`);
    console.log(cart);
}




