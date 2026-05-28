document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const listContainer = document.getElementById("orders-list");

  if (!currentUser) {
    listContainer.innerHTML = `
       <div style="text-align: center; margin-top: 50px; color: #fff; font-family: 'Circe', sans-serif;">
        <h2 data-i18n="history.please_auth">Пожалуйста, авторизуйтесь для просмотра истории услуг.</h2>
        <button class="history-btn btn-primary-history" onclick="location.href='auth.html'" style="margin-top: 15px;" data-i18n="history.login_page">Страница входа</button>
      </div>
    `;
    window.translatePage();
    return;
  }

  let ordersCache = [];

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/orders?userId=${currentUser.id}`,
      );
      if (!response.ok) {
        throw new Error(`Ошибка загрузки истории заказов: ${response.status}`);
      }
      ordersCache = await response.json();
      renderOrders(ordersCache);
    } catch (error) {
      console.error("Ошибка получения истории:", error);
      listContainer.innerHTML =
        "<p style='color: #fff; font-family: Circe;' data-i18n='catalog.error_loading'>Не удалось загрузить историю услуг.</p>";
      window.translatePage();
    }
  };

  function renderOrders(ordersList) {
    listContainer.innerHTML = "";

    if (!ordersList || ordersList.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; margin-top: 30px; font-family: 'Circe', sans-serif;">
          <p style="color: rgba(255,255,255,0.6); margin-bottom: 20px;" data-i18n="history.no_orders">У вас пока нет оформленных услуг или заказов.</p>
          <button class="history-btn btn-primary-history" onclick="location.href='../main.HTML#favor'" data-i18n="history.go_to_services">Перейти к услугам</button>
        </div>
      `;
      window.translatePage();
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    ordersList.forEach((order) => {
      const card = document.createElement("div");
      card.className = "order-card";

      const header = document.createElement("div");
      header.className = "order-header";
      header.innerHTML = `
          <span class="order-id"><span data-i18n="history.order">Заказ</span> #${order.id}</span>
        <span class="order-date-processed"><span data-i18n="history.date_processed">Оформлен</span>: ${order.date}</span>
      `;
      card.appendChild(header);

      const itemsContainer = document.createElement("div");
      itemsContainer.className = "order-items-list";

      let hasUpcomingService = false;
      let isService = false;

      order.items.forEach((item) => {
        const itemEl = document.createElement("div");
        itemEl.className = "order-item-detail";

        const localizedName = window.getLocalizedValue(item, "name");
        const localizedSubcat = window.getLocalizedValue(item, "subcategory");

        const nameText = localizedSubcat
          ? `${localizedSubcat}: ${localizedName}`
          : localizedName;

        let bookingDetailsHtml = "";
        let badgeHtml = "";

        if (item.bookingDate) {
          isService = true;
          const bDate = new Date(item.bookingDate);
          bDate.setHours(0, 0, 0, 0);

          const isUpcoming = bDate >= today;
          if (isUpcoming) hasUpcomingService = true;

          badgeHtml = isUpcoming
            ? `<span class="order-badge badge-upcoming" data-i18n="history.badge_upcoming">Предстоящая</span>`
            : `<span class="order-badge badge-completed" data-i18n="history.badge_completed">Завершена</span>`;

          bookingDetailsHtml = `
             <p class="item-booking-info">
              <span data-i18n="history.booking_date">Дата записи</span>: <span>${item.bookingDate}</span> | 
              <span data-i18n="history.master">Мастер</span>: <span>${item.masterName || "Не указан"}</span>
            </p>
          `;
        } else {
          badgeHtml = `<span class="order-badge badge-completed" data-i18n="history.badge_product">Покупка товара</span>`;
        }

        itemEl.innerHTML = `
          <div class="item-title-row">
            <span class="item-name">${nameText}</span>
            <span class="item-price">${item.price} ₽</span>
          </div>
          ${bookingDetailsHtml}
          ${badgeHtml}
        `;
        itemsContainer.appendChild(itemEl);
      });
      card.appendChild(itemsContainer);

      const actions = document.createElement("div");
      actions.className = "order-actions";

      if (isService) {
        if (hasUpcomingService) {
          actions.innerHTML = `
           <button class="history-btn btn-outline-history" onclick="alert(window.getLang() === 'ru' ? 'Для переноса или отмены записи свяжитесь с нами: +7 (995) 099-27-57' : 'To reschedule or cancel, please contact us: +7 (995) 099-27-57')" data-i18n="history.manage_booking">Управление записью</button>
          `;
        } else {
          actions.innerHTML = `
            <button class="history-btn btn-outline-history" onclick="location.href='feedback.html'" data-i18n="history.leave_review">Оставить отзыв</button>
            <button class="history-btn btn-primary-history" onclick="location.href='../main.HTML#favor'" data-i18n="history.rebook">Записаться снова</button>
          `;
        }
      } else {
        actions.innerHTML = `
        <button class="history-btn btn-outline-history" onclick="location.href='catalog.html'" data-i18n="history.to_catalog">В каталог</button>
        `;
      }

      card.appendChild(actions);
      listContainer.appendChild(card);
    });
    window.translatePage();
  }

  window.addEventListener("languageChanged", () => {
    renderOrders(ordersCache);
  });

  await fetchOrders();
});
