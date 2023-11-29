//Images Slider
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
