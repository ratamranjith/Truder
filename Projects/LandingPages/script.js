function toggleMenu() {
    var menu = document.querySelector('.menu');
    menu.classList.toggle('show');
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      var loaderWrapper = document.querySelector('.loader-wrapper');
      loaderWrapper.style.display = 'none';
      var clouds = document.querySelector('.clouds');
      clouds.style.animation = 'none'; // Stop cloud animation after loader
      var menuBtn = document.querySelector('.menu-btn');
      menuBtn.style.display = 'block';
    }, 3000); // Adjust the time according to your needs
  });
  