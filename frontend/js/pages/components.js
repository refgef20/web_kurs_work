import "./accessibility.js";

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let authSection = `<button class="button-login" id="login-nav-btn" data-i18n="header.login">Войти</button>`;
    let adminLink = "";

    if (currentUser) {
      authSection = `
        <div class="user-profile-nav">
          <span class="user-profile-username">@${currentUser.username}</span>
          <button class="button-login" id="logout-btn" data-i18n="header.logout">Выйти</button>
        </div>
      `;
      if (currentUser.role === "admin") {
        adminLink = `<li><a class="navigation-item admin-nav-link" href="admin.html" data-i18n="header.admin">Админ</a></li>`;
      }
    }
    this.innerHTML = `
    <div id="preloader" class="preloader">
    <div class="preloader-content">
       
        <div class="preloader-logo">ANNETKA</div>

        <div class="preloader-spinner"></div>
    </div>
</div>
     <header>
      <div class="head">
        <p class="item-icon">Annetka.Hair</p>
        
        <div style="display:flex; gap:10px; align-items:center; margin-right:15px; margin-left: auto;">

          <div class="lang-selector-container" style="display:flex; gap:10px; align-items:center;">
            <button class="lang-switch-btn" data-lang="ru" style="background:none; border:none; color:#fff; cursor:pointer; font-size:13px;">RU</button>
            <span style="color:rgba(255,255,255,0.3)">|</span>
            <button class="lang-switch-btn" data-lang="en" style="background:none; border:none; color:#fff; cursor:pointer; font-size:13px;">EN</button>
          </div>

          <button id="theme-toggle-btn" style="background:none; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#fff; padding:5px;">
            <span id="theme-icon-container" style="display:flex; align-items:center; justify-content:center;"></span>
          </button>
        </div>

        <div class="burger" id="burger-btn">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul class="navigation" id="nav-menu">
          <li><a class="navigation-item" href="../main.HTML#favor" data-i18n="header.services">Услуги</a></li>
          <li><a class="navigation-item" href="../main.HTML#master" data-i18n="header.masters">Мастера</a></li>
          <li><a class="navigation-item" href="feedback.html" data-i18n="header.reviews">Отзывы</a></li>
          <li><a class="navigation-item" href="../main.HTML" data-i18n="header.main">Главная</a></li>
          <li><a class="navigation-item" href="cart.html" data-i18n="header.cart">Корзина</a></li>
          <li><a class="navigation-item" href="catalog.html" data-i18n="header.catalog">Каталог</a></li>
          <li><a class="navigation-item" href="favorites.html" data-i18n="header.favorites">Избранное</a></li>
          <li><a class="navigation-item" href="history.html" data-i18n="header.history">История заказов</a></li>
          <li><a class="navigation-item" href="profile.html" data-i18n="header.profile">Личный кабинет</a></li>
          <li><button class="navigation-item accessibility-open-btn" type="button" data-i18n="header.accessibility">Версия для слабовидящих</button></li>
          ${adminLink}
          <li class="container-for-button">
             ${authSection}
          </li>
          <li class="mobile-drawer-footer">
            <p class="drawer-address" data-i18n="header.address">Москва, м. Парк Победы<br>Улица 1812 года, дом 1</p>
            <div class="drawer-socials">
              <span>IN</span>
              <span>VK</span>
              <span>FC</span>
            </div>
          </li>
        </ul>
        <div class="drawer-overlay" id="menu-overlay"></div>
      </div>
    </header>
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
        location.href = "../main.HTML";
      });
    }

    const loginNavBtn = this.querySelector("#login-nav-btn");
    if (loginNavBtn) {
      loginNavBtn.addEventListener("click", () => {
        location.href = "auth.html";
      });
    }

    this.querySelectorAll(".lang-switch-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const targetLang = e.target.getAttribute("data-lang");
        window.setLanguage(targetLang);
      });
    });

    const accessibilityBtn = this.querySelector(".accessibility-open-btn");
    if (accessibilityBtn) {
      accessibilityBtn.addEventListener("click", () => {
        window.openAccessibilityPanel();
      });
    }

    // Логика переключения тем оформления
    const themeToggleBtn = this.querySelector("#theme-toggle-btn");
    const themeIconContainer = this.querySelector("#theme-icon-container");

    const sunIcon = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-svg" style="color: inherit;">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;

    const moonIcon = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-svg" style="color: inherit;">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;

    const applyTheme = (theme) => {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      if (theme === "white") {
        themeIconContainer.innerHTML = moonIcon;
      } else {
        themeIconContainer.innerHTML = sunIcon;
      }
    };

    const currentTheme = localStorage.getItem("theme") || "black";
    applyTheme(currentTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        const activeTheme =
          document.documentElement.getAttribute("data-theme") || "black";
        const newTheme = activeTheme === "black" ? "white" : "black";
        applyTheme(newTheme);
      });
    }

    if (window.translatePage) {
      window.translatePage();
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
                <p class="item-punkt1" data-i18n="footer.address_lbl">Адрес</p>
                <p class="item-punkt2" data-i18n="header.address">
                  Москва, м. Парк Победы, Улица 1812 года, дом 1
                </p>
              </div>
              <div class="punkt">
                <p class="item-punkt1" data-i18n="footer.phone_lbl">Телефон</p>
                <p class="item-punkt2" data-i18n="header.phone">+7 (995) 099-27-57</p>
              </div>
              <div class="punkt punkt1">
                <p class="item-punkt1" data-i18n="footer.hours_lbl">Время работы</p>
                <p class="item-punkt2" data-i18n="footer.hours_workdays">пн-пт 7:00 - 23:00</p>
                <p class="item-punkt2" data-i18n="footer.hours_weekends">сб-вс: 11:00 - 22:00</p>
              </div>
              <div class="punkt">
                <p class="item-punkt1" data-i18n="footer.socials_lbl">соц. сети</p>
                <div class="social-media2">
                  <p class="item-social2">in</p>
                  <p class="item-social2">vk</p>
                  <p class="item-social2">fc</p>
                </div>
              </div>
            </div>
            <button class="button-under-menu" data-i18n="main.write_btn">Наши услуги</button>
          </div>
          <div class="cards-navigation">
             <p class="tittle-card" data-i18n="footer.map_title">Карта</p>
            <iframe 
              src="https://yandex.ru/map-widget/v1/?text=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%201812%20%D0%B3%D0%BE%D0%B4%D0%B0%2C%20%D0%B4%D0%BE%D0%BC%201&z=16" 
              width="100%" 
              height="250" 
              style="border:0; border-radius: 8px;" 
              allowfullscreen="true">
            </iframe>
          </div>
        </div>
        <div class="footer-with-line">
          <hr class="line-footer" />
          <div class="footer-with-nav">
            <p class="logo">annetka.hair</p>
            <ul class="navigation2">
              <li><a class="navigation-item" href="!#" data-i18n="header.services">Услуги</a></li>
              <li><a class="navigation-item" href="" data-i18n="header.masters">Мастера</a></li>
              <li><a class="navigation-item" href="" data-i18n="header.reviews">Отзывы</a></li>
              <li><a class="navigation-item" href="" data-i18n="footer.works">Работы</a></li>
              
            </ul>
            <div class="copyright">
              <p class="year">2014-2022</p>
              <p class="year" data-i18n="footer.privacy">Политика конфидициальности</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
    `;
    if (window.translatePage) {
      window.translatePage();
    }
  }
}
customElements.define("site-footer", SiteFooter);
