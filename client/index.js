let button = document.querySelector('[data-send]');

button.addEventListener('click', () => {
   button.style.transform = 'translateX(5px)';
   setTimeout(() => {
      button.style.transform = 'translateX(0px)';
   }, 100);
});