import { login, logout } from './login';
import { addToCart } from './cartMain.js';

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

if (inputFields) {
  inputFields.forEach(input => {
    input.addEventListener('input', e => {
      if (input.value.length > 2) input.value = input.value.slice(0, 2);
      if (input.value.startsWith(0)) input.value = input.value.slice(1);
      const product = input.closest('.sc-product');
      const productPrice = product.querySelector('.sc-product__price');
      const productTotalPrice = product.querySelector('.sc-product__total');
      productTotalPrice.textContent = `$${(+productPrice.textContent.slice(1) * +input.value).toFixed(2)}`;
    });
  });
}
