import { login, logout } from './login';
import { addToCart } from './cartMain.js';
import { changeQuantity, checkOut } from './shoppingCart.js';

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

if (imgs) {
  const imgBtns = [...imgs];
  let imgID = 1;

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

// Shopping Cart
const inputFields = document.querySelectorAll('.sc-product #amount');
const allTotalPrice = document.querySelectorAll('.sc-product__total');
const leftArrows = document.querySelectorAll('.sc-product .ph-arrow-square-left');
const rightArrows = document.querySelectorAll('.sc-product .ph-arrow-square-right');

const recalculateTotal = () => {
  const totalEl = document.querySelector('.sc-info__total-price span');
  const discountEl = document.querySelector('.sc-info__discount span');
  const finalEl = document.querySelector('.sc-info__final-price span');
  let total = 0;
  allTotalPrice.forEach(el => (total += +el.textContent.slice(1)));
  totalEl.textContent = `$${total.toFixed(2)}`;
  finalEl.textContent = `$${(totalEl.textContent.slice(1) - discountEl.textContent.slice(1)).toFixed(2)}`;
};

const changeQtyAndCalcProdTotal = (product, inputFld) => {
  const productPrice = product.querySelector('.sc-product__price');
  const productTotalPrice = product.querySelector('.sc-product__total');

  productTotalPrice.textContent = `$${(+productPrice.textContent.slice(1) * +inputFld.value).toFixed(2)}`;

  const productName = product.querySelector('.heading-tertiary').textContent;
  console.log(+inputFld.value);
  changeQuantity(productName, +inputFld.value);
  recalculateTotal();
};

const changeArrowClass = (product, input) => {
  +input.value === 1
    ? product.querySelector('.ph-arrow-square-left').classList.add('arrow--shade')
    : product.querySelector('.ph-arrow-square-left').classList.remove('arrow--shade');
  +input.value === 99
    ? product.querySelector('.ph-arrow-square-right').classList.add('arrow--shade')
    : product.querySelector('.ph-arrow-square-right').classList.remove('arrow--shade');
};

if (inputFields) {
  inputFields.forEach(input => {
    input.addEventListener('input', e => {
      if (input.value.length > 2) input.value = input.value.slice(0, 2);
      if (input.value.startsWith(0)) input.value = input.value.slice(1);

      const product = input.closest('.sc-product');

      changeArrowClass(product, input);

      changeQtyAndCalcProdTotal(product, input);
    });
  });
}

if (leftArrows || rightArrows) {
  leftArrows.forEach(arrow => {
    arrow.addEventListener('click', e => {
      const product = arrow.closest('.sc-product');
      const inputField = product.querySelector('#amount');

      inputField.value > 1 ? inputField.value-- : (inputField.value = 1);

      changeArrowClass(product, inputField);

      changeQtyAndCalcProdTotal(product, inputField);
    });
  });

  rightArrows.forEach(arrow => {
    arrow.addEventListener('click', e => {
      const product = arrow.closest('.sc-product');
      const inputField = product.querySelector('#amount');

      inputField.value < 99 ? inputField.value++ : (inputField.value = 99);

      changeArrowClass(product, inputField);

      changeQtyAndCalcProdTotal(product, inputField);
    });
  });
}

// Product Page
const inputField = document.querySelector('.product-content #amount');
const addToCartPDP = document.querySelector('.product-content .add-to-cart-btn');
const leftArrow = document.querySelector('.product-content .ph-arrow-square-left');
const rightArrow = document.querySelector('.product-content .ph-arrow-square-right');

if (inputField) {
  inputField.addEventListener('input', e => {
    if (inputField.value.length > 2) inputField.value = inputField.value.slice(0, 2);
    if (inputField.value.startsWith(0)) inputField.value = inputField.value.slice(1);

    const product = document.querySelector('.product-content');

    changeArrowClass(product, inputField);
  });
}

if (leftArrow || rightArrow) {
  leftArrow.addEventListener('click', e => {
    const product = document.querySelector('.product-content');
    const inputField = product.querySelector('#amount');

    inputField.value > 1 ? inputField.value-- : (inputField.value = 1);

    changeArrowClass(product, inputField);
  });

  rightArrow.addEventListener('click', e => {
    const product = document.querySelector('.product-content');
    const inputField = product.querySelector('#amount');

    inputField.value < 99 ? inputField.value++ : (inputField.value = 99);

    changeArrowClass(product, inputField);
  });
}

if (addToCartPDP) {
  addToCartPDP.addEventListener('click', e => {
    const productName = document.querySelector('.heading-secondary').textContent;
    const input = document.querySelector('#amount').value;

    addToCart(productName, +input);
  });
}

// Scroll
const OBSbtn = document.querySelector('.hero-btn');
if (OBSbtn) {
  document.querySelector('.hero-btn').addEventListener('click', function (e) {
    e.preventDefault();

    const href = OBSbtn.getAttribute('href');

    if (href === '#') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    if (href !== '#' && href.startsWith('#')) {
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
}

//Check Out
const checkOutBtn = document.querySelector('.check-out-btn');

if (checkOutBtn) checkOutBtn.addEventListener('click', checkOut);
