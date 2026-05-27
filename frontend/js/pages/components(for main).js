class SiteHeader extends HTMLElement {
  connectedCallback() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let authSection = `<button class="button-login" id="login-nav-btn">Войти</button>`;
    let adminLink = "";

    if (currentUser) {
      authSection = `
        <div class="user-profile-nav">
          <span class="user-profile-username">@${currentUser.username}</span>
          <button class="button-login" id="logout-btn">Выйти</button>
        </div>
      `;
      if (currentUser.role === "admin") {
        adminLink = `<li><a class="navigation-item admin-nav-link" href="pages/admin.html">Админ</a></li>`;
      }
    }
    this.innerHTML = `
      <div class="head">
        <p class="item-icon">Annetka.Hair</p>
        <div class="burger" id="burger-btn">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul class="navigation" id="nav-menu">
          <li><a class="navigation-item" href="#favor">Услуги</a></li>
          <li><a class="navigation-item" href="#master">Мастера</a></li>
          <li><a class="navigation-item" href="pages/feedback.html">Отзывы</a></li>
          <li><a class="navigation-item" href="main.HTML">Главная</a></li>
          <li><a class="navigation-item" href="pages/cart.html">Корзина</a></li>
          <li><a class="navigation-item" href="pages/catalog.html">Каталог</a></li>
          <li><a class="navigation-item" href="pages/favorites.html">Избранное</a></li>
          <li><a class="navigation-item" href="pages/history.html">История заказов</a></li>
          <li><a class="navigation-item" href="pages/profile.html">Личный кабинет</a></li>
          ${adminLink}
          <li class="container-for-button">
             ${authSection}
          </li>
          <li class="mobile-drawer-footer">
            <p class="drawer-address">Москва, м. Парк Победы<br>Улица 1812 года, дом 1</p>
            <div class="drawer-socials">
              <span>IN</span>
              <span>VK</span>
              <span>FC</span>
            </div>
          </li>
        </ul>
        <div class="drawer-overlay" id="menu-overlay"></div>
      </div>
    `;

    const burgerBtn = this.querySelector("#burger-btn");
    const navMenu = this.querySelector("#nav-menu");
    const overlay = this.querySelector("#menu-overlay");

    if (burgerBtn && navMenu && overlay) {
      const toggleMenu = () => {
        burgerBtn.classList.toggle("active");
        navMenu.classList.toggle("active");
        overlay.classList.toggle("active");
      };

      burgerBtn.addEventListener("click", toggleMenu);
      overlay.addEventListener("click", toggleMenu);
    }

    const logoutBtn = this.querySelector("#logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        location.href = "main.HTML";
      });
    }

    const loginNavBtn = this.querySelector("#login-nav-btn");
    if (loginNavBtn) {
      loginNavBtn.addEventListener("click", () => {
        location.href = "pages/auth.html";
      });
    }
  }
}
customElements.define("site-header", SiteHeader);

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
     <footer>
      <div class="container-for-footer">
        <div class="cards-allInfo">
          <div class="menu-with-bitton">
            <div class="menu">
              <div class="punkt">
                <p class="item-punkt1">Адрес</p>
                <p class="item-punkt2">
                  Москва, м. Парк Победы, Улица 1812 года, дом 1
                </p>
              </div>
              <div class="punkt">
                <p class="item-punkt1">Телефон</p>
                <p class="item-punkt2">+7 (995) 099-27-57</p>
              </div>
              <div class="punkt punkt1">
                <p class="item-punkt1">Время работы</p>
                <p class="item-punkt2">пн-пт 7:00 - 23:00</p>
                <p class="item-punkt2">сб-вс: 11:00 - 22:00</p>
              </div>
              <div class="punkt">
                <p class="item-punkt1">соц. сети</p>
                <div class="social-media2">
                  <p class="item-social2">in</p>
                  <p class="item-social2">vk</p>
                  <p class="item-social2">fc</p>
                </div>
              </div>
            </div>
            <button class="button-under-menu">Записаться</button>
          </div>
      <div class="cards-navigation">
  <p class="tittle-card">Карта</p>
  <div class="map-wrapper">
    <iframe 
      src="https://yandex.ru/map-widget/v1/?ll=37.523528%2C55.734658&mode=search&oid=1107572718&ol=biz&z=16" 
      width="100%" 
      height="100%" 
      frameborder="0" 
      allowfullscreen="true">
    </iframe>
  </div>
</div>
        </div>
        <div class="footer-with-line">
          <hr class="line-footer" />
          <div class="footer-with-nav">
            <p class="logo">annetka.hair</p>
            <ul class="navigation2">
              <li><a class="navigation-item" href="!#">Услуги</a></li>
              <li><a class="navigation-item" href="">Мастера</a></li>
              <li><a class="navigation-item" href="">Отзывы</a></li>
              <li><a class="navigation-item" href="">Работы</a></li>
              <li><a class="navigation-item" href="">Контакты</a></li>
            </ul>
            <div class="copyright">
              <p class="year">2014-2022</p>
              <p class="year">Политика конфидициальности</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
    `;
  }
}
customElements.define("site-footer", SiteFooter);
