window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.classList.add("preloader-hidden");
    setTimeout(() => {
      preloader.remove();
    }, 500);
  }
});
