document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const listContainer = document.getElementById("orders-list");

  // Проверка авторизации (аналогично cart.js)
  if (!currentUser) {
    listContainer.innerHTML = `
      <div style="text-align: center; margin-top: 50px; color: #fff; font-family: 'Circe', sans-serif;">
        <h2>Пожалуйста, авторизуйтесь для просмотра истории услуг.</h2>
        <button class="history-btn btn-primary-history" onclick="location.href='auth.html'" style="margin-top: 15px;">Страница входа</button>
      </div>
    `;
    return;
  }

  try {
    // Получаем список заказов авторизованного пользователя
    const response = await fetch(
      `http://localhost:3000/orders?userId=${currentUser.id}`,
    );
    if (!response.ok) {
      throw new Error(`Ошибка загрузки истории заказов: ${response.status}`);
    }
    const orders = await response.json();
    renderOrders(orders);
  } catch (error) {
    console.error("Ошибка получения истории:", error);
    listContainer.innerHTML =
      "<p style='color: #fff; font-family: Circe;'>Не удалось загрузить историю услуг.</p>";
  }

  function renderOrders(ordersList) {
    listContainer.innerHTML = "";

    if (!ordersList || ordersList.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; margin-top: 30px; font-family: 'Circe', sans-serif;">
          <p style="color: rgba(255,255,255,0.6); margin-bottom: 20px;">У вас пока нет оформленных услуг или заказов.</p>
          <button class="history-btn btn-primary-history" onclick="location.href='../main.HTML#favor'">Перейти к услугам</button>
        </div>
      `;
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    ordersList.forEach((order) => {
      const card = document.createElement("div");
      card.className = "order-card";

      // Шапка карточки заказа
      const header = document.createElement("div");
      header.className = "order-header";
      header.innerHTML = `
        <span class="order-id">Заказ #${order.id}</span>
        <span class="order-date-processed">Оформлен: ${order.date}</span>
      `;
      card.appendChild(header);

      const itemsContainer = document.createElement("div");
      itemsContainer.className = "order-items-list";

      let hasUpcomingService = false;
      let isService = false;

      order.items.forEach((item) => {
        const itemEl = document.createElement("div");
        itemEl.className = "order-item-detail";

        // Если подкатегория записана, выводим её как основное имя услуги
        const nameText = item.subcategory
          ? `${item.subcategory}: ${item.name}`
          : item.name;

        let bookingDetailsHtml = "";
        let badgeHtml = "";

        if (item.bookingDate) {
          isService = true;
          const bDate = new Date(item.bookingDate);
          bDate.setHours(0, 0, 0, 0);

          // Динамически определяем статус завершенности по дате
          const isUpcoming = bDate >= today;
          if (isUpcoming) hasUpcomingService = true;

          badgeHtml = isUpcoming
            ? `<span class="order-badge badge-upcoming">Предстоящая</span>`
            : `<span class="order-badge badge-completed">Завершена</span>`;

          bookingDetailsHtml = `
            <p class="item-booking-info">
              Дата записи: <span>${item.bookingDate}</span> | 
              Мастер: <span>${item.masterName || "Не указан"}</span>
            </p>
          `;
        } else {
          // Если это обычный товар
          badgeHtml = `<span class="order-badge badge-completed">Покупка товара</span>`;
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

      // Блок кнопок действий внизу карточки
      const actions = document.createElement("div");
      actions.className = "order-actions";

      if (isService) {
        if (hasUpcomingService) {
          actions.innerHTML = `
            <button class="history-btn btn-outline-history" onclick="alert('Для переноса или отмены записи свяжитесь с нами: +7 (995) 099-27-57')">Управление записью</button>
          `;
        } else {
          actions.innerHTML = `
            <button class="history-btn btn-outline-history" onclick="location.href='feedback.html'">Оставить отзыв</button>
            <button class="history-btn btn-primary-history" onclick="location.href='../main.HTML#favor'">Записаться снова</button>
          `;
        }
      } else {
        actions.innerHTML = `
          <button class="history-btn btn-outline-history" onclick="location.href='catalog.html'">В каталог</button>
        `;
      }

      card.appendChild(actions);
      listContainer.appendChild(card);
    });
  }
});
