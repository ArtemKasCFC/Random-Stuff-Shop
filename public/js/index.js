import { login, logout } from './login';

const loginForm = document.querySelector('#login-form');
const logoutBtn = document.querySelector('#logout');

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

// Images Slider
const imgs = document.querySelectorAll('.img-select a');
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
