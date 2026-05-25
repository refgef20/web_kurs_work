class SiteHeader extends HTMLElement {
  connectedCallback() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let authSection = `<button class="button-login" id="login-nav-btn">Войти</button>`;
    let adminLink = "";

    if (currentUser) {
      authSection = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 0.9rem; font-weight: 500; color: #fff;">@${currentUser.username}</span>
          <button class="button-login" id="logout-btn" style="width: auto; padding: 0 12px;">Выйти</button>
        </div>
      `;
      if (currentUser.role === "admin") {
        adminLink = `<li><a class="navigation-item" href="admin.html" style="color: palevioletred; font-weight: bold;">Админ</a></li>`;
      }
    }
    this.innerHTML = `
     <header>
      <div class="head">
        <p class="item-icon">Annetka.Hair</p>
        <ul class="navigation">
          <li><a class="navigation-item" href="../main.HTML#favor">Услуги</a></li>
          <li><a class="navigation-item" href="../main.HTML#master">Мастера</a></li>
          <li><a class="navigation-item" href="feedback.html">Отзывы</a></li>
          <li><a class="navigation-item" href="../main.HTML">Главная</a></li>
          <li><a class="navigation-item" href="cart.html">Корзина</a></li>
          <li><a class="navigation-item" href="catalog.html">Каталог</a></li>
          <li><a class="navigation-item" href="favorites.html">Избранное</a></li>
          <li><a class="navigation-item" href="history.html">История заказов</a></li>
          ${adminLink}
          <div class="container-for-button">
             ${authSection}
          </div>
        </ul>
      </div>
    </header>
    `;
    const logoutBtn = this.querySelector("#logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        location.href = "../main.HTML";
      });
    }

    const loginNavBtn = this.querySelector("#login-nav-btn");
    if (loginNavBtn) {
      loginNavBtn.addEventListener("click", () => {
        location.href = "auth.html";
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
            <img src="/frontend/set/image/card.jpg" alt="" />
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
