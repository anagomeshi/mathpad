const appMask = document.querySelector('.app-mask');
const copyButton = document.querySelector('.copy-button');
const contextMenu = document.querySelector('.context-menu');

appMask.addEventListener('click', toggleContextMenu);
copyButton.addEventListener('click', toggleContextMenu);

function toggleContextMenu(){
  appMask.classList.toggle('app-mask-active');
  copyButton.classList.toggle('copy-button-active');
  contextMenu.classList.toggle('context-menu-show');
}