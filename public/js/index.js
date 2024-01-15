import { login, logout } from './login';
import { addToCart } from './cartMain.js';
import { changeQuantity } from './shoppingCart.js';

const loginForm = document.querySelector('#login-form');
const logoutBtn = document.querySelector('#logout');
const addToCartBtns = document.querySelectorAll('.product-btn');

// LogIn
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

// Add To Cart
addToCartBtns.forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const title = this.previousElementSibling.querySelector('.product-title').textContent;
    addToCart(title);
  });
});

// Images Slider
const imgs = document.querySelectorAll('.img-select a');
const imgBtns = [...imgs];
let imgID = 1;

if (imgs) {
  const slideImg = () => {
    const displayWidth = document.querySelector('.img-showcase img:first-child').clientWidth;
    document.querySelector('.img-showcase').style.transform = `translateX(${-(imgID - 1) * displayWidth}px)`;
  };

  imgBtns.forEach(imgBtn => {
    imgBtn.addEventListener('click', e => {
      e.preventDefault();
      imgID = imgBtn.dataset.id;
      slideImg();
    });
  });

  window.addEventListener('resize', slideImg);
}

// Input Field
const inputFields = document.querySelectorAll('#amount');
// const allDiscounts = document.querySelectorAll('.sc-product__discount');
const allTotalPrice = document.querySelectorAll('.sc-product__total');

const recalculateTotal = () => {
  const totalEl = document.querySelector('.sc-info__total-price span');
  const discountEl = document.querySelector('.sc-info__discount span');
  const finalEl = document.querySelector('.sc-info__final-price span');
  let total = 0;
  // allDiscounts.forEach(el => console.log(el.textContent.slice(1)));
  allTotalPrice.forEach(el => (total += +el.textContent.slice(1)));
  totalEl.textContent = `$${total.toFixed(2)}`;
  finalEl.textContent = `$${(totalEl.textContent.slice(1) - discountEl.textContent.slice(1)).toFixed(2)}`;
};

if (inputFields) {
  inputFields.forEach(input => {
    input.addEventListener('input', e => {
      if (input.value.length > 2) input.value = input.value.slice(0, 2);
      if (input.value.startsWith(0)) input.value = input.value.slice(1);
      const product = input.closest('.sc-product');
      const productPrice = product.querySelector('.sc-product__price');
      const productTotalPrice = product.querySelector('.sc-product__total');
      productTotalPrice.textContent = `$${(+productPrice.textContent.slice(1) * +input.value).toFixed(2)}`;

      const productName = product.querySelector('.heading-tertiary').textContent;
      changeQuantity(productName, +input.value);

      recalculateTotal();
    });
  });
}
