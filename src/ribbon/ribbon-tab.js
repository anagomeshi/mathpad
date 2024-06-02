const ribbonHeaderButton = document.querySelectorAll('.ribbon-header-button');

for(i=0;i < ribbonHeaderButton.length;i++){
  ribbonHeaderButton[i].addEventListener('click',changeTabContent);
}

function changeTabContent(){
  const selectedButton = document.querySelector('.selected');
  const targetButton = event.target.closest('.ribbon-header-button');
  const targetDataTab = targetButton.getAttribute('data-tab');
  const showRibbonContent = document.querySelector('.show');
  const targetRibbonContent = document.getElementById(targetDataTab);

  console.log(selectedButton);
  selectedButton.classList.remove('selected');
  targetButton.classList.add('selected');
  
  showRibbonContent.classList.remove('show');
  targetRibbonContent.classList.add('show');
}
