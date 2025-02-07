const appMask = document.querySelector('.app-mask');
const copyButton = document.querySelector('.copy-button');
const popup = document.querySelector('.popup');

appMask.addEventListener('click', togglePopup);
copyButton.addEventListener('click', togglePopup);

function togglePopup(){
  appMask.classList.toggle('app-mask-active');
  copyButton.classList.toggle('copy-button-active');
  popup.classList.toggle('popup-show');
}
