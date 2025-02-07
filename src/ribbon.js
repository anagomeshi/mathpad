const ribbonTabs = document.querySelectorAll('.ribbon-tab');

for (i = 0; i < ribbonTabs.length; i++) {
  ribbonTabs[i].addEventListener('click', changeTabContent);
}

function changeTabContent() {
  const selectedTab = document.querySelector('.tab-selected');
  const targetTab = event.target.closest('.ribbon-tab');
  const targetDataTab = targetTab.getAttribute('data-tab');
  const showRibbonContent = document.querySelector('.tab-show');
  const targetRibbonContent = document.getElementById(targetDataTab);

  selectedTab.classList.remove('tab-selected');
  targetTab.classList.add('tab-selected');

  showRibbonContent.classList.remove('tab-show');
  targetRibbonContent.classList.add('tab-show');
}
