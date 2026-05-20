class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
     <header>
      <div class="head">
        <p class="item-icon">Annetka.Hair</p>
        <ul class="navigation">
          <li><a class="navigation-item" href="#favor">Услуги</a></li>
          <li><a class="navigation-item" href="">Мастера</a></li>
          <li><a class="navigation-item" href="">Отзывы</a></li>
          <li><a class="navigation-item" href="">Работы</a></li>
          <li><a class="navigation-item" href="">Контакты</a></li>
        </ul>
        <div class="burger">
          <span></span>
        </div>
      </div>
      <div class="description-annet">
        <div class="social-media">
          <p class="item-social">in</p>
          <p class="item-social">vk</p>
          <p class="item-social">fc</p>
        </div>
        <div class="annetka-zapis">
          <div class="sign">
            <hr class="line-sign" />
            <p class="item-sign">Салон красоты премиум класса</p>
          </div>
          <div class="annetka-texts-buttons">
            <p class="annet-item">Annetka.Hair</p>
            <div class="desc-but">
              <p class="annet-inem2">
                Annetka Hair - эксклюзивный салон красоты премиум класса,
                основная миссия которого - подарить Вам красивые волосы
              </p>
              <div class="buttons-annet">
                <button class="write-button">
                  <p class="items-button-annet">Записаться</p>
                </button>
                <button class="favor-button">
                  <p class="items-button-annet">Наши услуги</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="phone-address">
        <p class="address">Москва, м. Парк Победы, Улица 1812 года, дом 1</p>
        <p class="phone-number">+7 (995) 099-27-57</p>
      </div>
    </header>
    `;
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
