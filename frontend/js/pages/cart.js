const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const section = document.querySelector(".container-for-catalog");

// Хелпер для динамического подключения календаря Flatpickr в темной теме
function loadFlatpickr() {
  return new Promise((resolve) => {
    if (window.flatpickr) {
      resolve();
      return;
    }
    // Подключаем стили Flatpickr (темная тема под стиль UI KIT)
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/dark.css";
    document.head.appendChild(link);

    // Подключаем основной скрипт библиотеки
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/flatpickr";
    script.onload = () => {
      // Подключаем русскую локализацию календаря
      const ruScript = document.createElement("script");
      ruScript.src = "https://npmcdn.com/flatpickr/dist/l10n/ru.js";
      ruScript.onload = () => resolve();
      document.head.appendChild(ruScript);
    };
    document.body.appendChild(script);
  });
}

if (!currentUser) {
  section.innerHTML = `
      <div style="text-align: center; margin-top: 50px; color: #fff;">
        <h2>Пожалуйста, авторизуйтесь для просмотра корзины.</h2>
        <button class="my-custom-button" onclick="location.href='auth.html'" style="margin-top: 15px; background: #fff;">Страница входа</button>
      </div>
    `;
} else {
  const container = document.createElement("div");
  container.className = "container-for-catalog-cards";
  section.appendChild(container);

  async function loadProduct() {
    try {
      const response = await fetch(
        `http://localhost:3000/cart?userId=${currentUser.id}`,
      );
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
      const data = await response.json();
      renderCards(data);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      container.innerHTML =
        "<p style='color: #fff;'>Не удалось загрузить товары корзины.</p>";
    }
  }

  function renderCards(input) {
    container.innerHTML = "";
    if (!input || input.length === 0) {
      container.innerHTML = "<p style='color: #fff;'>Ваша корзина пуста</p>";
      return;
    }

    input.forEach((element) => {
      const currentAmount = element.amount || 1;
      const card = document.createElement("div");
      card.className = "container-for-every-card-mets";
      container.appendChild(card);

      const buyBtn = document.createElement("button");
      buyBtn.className = "buy-button-on-img";
      buyBtn.textContent = "Купить";
      buyBtn.addEventListener("click", () => {
        processPurchase(element);
      });
      card.appendChild(buyBtn);

      const image = document.createElement("img");
      image.className = "acne1";
      card.appendChild(image);
      image.src = element.photo;

      const text1 = document.createElement("p");
      text1.className = "item-first-card-mets";
      card.appendChild(text1);
      text1.textContent = element.subcategory
        ? element.subcategory
        : element.name;

      const text2 = document.createElement("p");
      text2.className = "item-first-card-mets1";
      card.appendChild(text2);
      text2.textContent = element.subcategory
        ? `${element.name} — ${element.description}`
        : element.description;

      const button = document.createElement("div");
      button.className = "container-for-button-catalog2";
      card.appendChild(button);

      const text_button = document.createElement("button");
      text_button.className = "button-emo itame-for-button-catalog";
      button.appendChild(text_button);
      text_button.textContent = "🗑️";
      text_button.addEventListener("click", () => {
        Delete(element);
      });

      const container_amount = document.createElement("div");
      container_amount.className = "container-buttons-amount";
      button.appendChild(container_amount);

      const plus = document.createElement("button");
      plus.className = "button-emo itame-for-button-catalog";
      plus.textContent = "+";
      container_amount.appendChild(plus);
      plus.addEventListener("click", () => {
        UpdateAmount(element.id, currentAmount + 1);
      });

      const amountText = document.createElement("span");
      amountText.style.color = "#fff";
      amountText.textContent = currentAmount;
      container_amount.appendChild(amountText);

      const minus = document.createElement("button");
      minus.className = "button-emo itame-for-button-catalog";
      minus.textContent = "-";
      container_amount.appendChild(minus);
      minus.addEventListener("click", () => {
        if (currentAmount > 1) {
          UpdateAmount(element.id, currentAmount - 1);
        } else {
          Delete(element);
        }
      });

      const cost = document.createElement("p");
      cost.className = "itame-for-button-for-last3cardmets1";
      button.appendChild(cost);

      const price = parseFloat(element.price || 0);
      const total = price * currentAmount;
      cost.textContent = total + " ₽";
    });
  }

  // Динамическое модальное окно для оформления записи на услугу
  async function showBookingModal(product) {
    // Подгружаем библиотеку Flatpickr перед открытием
    await loadFlatpickr();

    let masters = [];
    let orders = [];

    try {
      const [resMasters, resOrders] = await Promise.all([
        fetch("http://localhost:3000/masters"),
        fetch("http://localhost:3000/orders"),
      ]);

      if (resMasters.ok) masters = await resMasters.json();
      if (resOrders.ok) orders = await resOrders.json();
    } catch (e) {
      console.error("Ошибка при получении данных бронирования:", e);
    }

    const nameLower = product.name.toLowerCase().replace(/ё/g, "е");

    let targetCategory = "";
    if (nameLower.includes("стриж")) {
      targetCategory = "haircut";
    } else if (nameLower.includes("уклад")) {
      targetCategory = "styling";
    } else if (nameLower.includes("окраш")) {
      targetCategory = "coloring";
    } else if (nameLower.includes("уход")) {
      targetCategory = "care";
    }

    let targetQualification = "";
    if (nameLower.includes("стажер")) {
      targetQualification = "стажер";
    } else if (nameLower.includes("профи")) {
      targetQualification = "профи";
    } else if (nameLower.includes("мастер")) {
      targetQualification = "мастер";
    }

    const filteredMasters = masters.filter((m) => {
      const matchesCategory = !targetCategory || m.category === targetCategory;
      const matchesQualification =
        !targetQualification || m.qualification === targetQualification;
      return matchesCategory && matchesQualification;
    });

    const modal = document.createElement("div");
    modal.className = "custom-booking-modal";

    const styleTag = document.createElement("style");
    styleTag.textContent = `
      .custom-booking-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-family: 'Circe', sans-serif;
      }
      .modal-box {
        background: #111;
        border: 1px solid #333;
        border-radius: 16px;
        padding: clamp(20px, 4vw, 35px);
        width: 90%;
        max-width: 450px;
        color: #fff;
        box-shadow: 0 10px 30px rgba(113, 22, 92, 0.2);
      }
      .modal-box h2 {
        font-family: 'Vera Humana', sans-serif;
        color: #fff;
        font-size: 24px;
        text-transform: uppercase;
        margin-bottom: 20px;
        text-align: center;
      }
      .modal-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 18px;
      }
      .modal-field label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
      }
      .modal-field select, .modal-field input {
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 8px;
        padding: 10px;
        color: #fff;
        font-family: 'Circe', sans-serif;
        font-size: 16px;
        outline: none;
      }
      .modal-field select:focus, .modal-field input:focus {
        border-color: #71165b;
      }
      .modal-actions {
        display: flex;
        gap: 12px;
        margin-top: 10px;
      }
      .modal-btn {
        flex: 1;
        padding: 12px;
        border-radius: 30px;
        font-size: 14px;
        font-weight: bold;
        text-transform: uppercase;
        cursor: pointer;
        border: none;
        transition: 0.3s;
      }
      .modal-btn-primary {
        background: #71165b;
        color: #fff;
      }
      .modal-btn-primary:hover {
        background: #8e1e74;
      }
      .modal-btn-cancel {
        background: transparent;
        border: 1px solid #fff;
        color: #fff;
      }
      .modal-btn-cancel:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    `;
    document.head.appendChild(styleTag);

    let masterOptions = "";
    if (filteredMasters.length > 0) {
      masterOptions = filteredMasters
        .map(
          (m) =>
            `<option value="${m.id}">${m.name} (${m.qualification})</option>`,
        )
        .join("");
    } else {
      const qualText = targetQualification
        ? `категории "${targetQualification}"`
        : "данной категории";
      masterOptions = `<option value="">Нет свободных мастеров ${qualText} для этой услуги</option>`;
    }

    modal.innerHTML = `
      <div class="modal-box">
        <h2>Оформление услуги</h2>
        <form id="booking-modal-form">
          <div class="modal-field">
            <label>Выбранная услуга</label>
            <input type="text" value="${product.name}" readonly style="opacity: 0.7;">
          </div>
          <div class="modal-field">
            <label for="modal-master">Желаемый мастер</label>
            <select id="modal-master" required>
              ${masterOptions}
            </select>
          </div>
          <div class="modal-field">
            <label for="modal-date">Желаемая дата записи</label>
            <input type="text" id="modal-date" placeholder="Выберите свободный день" required>
          </div>
          <div class="modal-actions">
            <button type="button" class="modal-btn modal-btn-cancel" id="modal-cancel-btn">Отмена</button>
            <button type="submit" class="modal-btn modal-btn-primary" id="booking-submit-btn" disabled style="opacity:0.5; cursor:not-allowed;">Записаться</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    const masterSelect = modal.querySelector("#modal-master");
    const dateInput = modal.querySelector("#modal-date");
    const submitBtn = modal.querySelector("#booking-submit-btn");

    let datepickerInstance = null;

    // Логика обновления активных дат календаря на основе выбранного мастера
    function updateCalendarAvailability() {
      const selectedMasterId = masterSelect.value;

      // Выбираем из базы все занятые дни конкретно для этого мастера
      const disabledDates = [];
      orders.forEach((order) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item) => {
            if (item.masterId === selectedMasterId && item.bookingDate) {
              disabledDates.push(item.bookingDate);
            }
          });
        }
      });

      // Пересоздаем календарь под выбранного мастера
      if (datepickerInstance) {
        datepickerInstance.destroy();
      }

      datepickerInstance = flatpickr(dateInput, {
        locale: "ru",
        dateFormat: "Y-m-d",
        minDate: "today",
        disable: disabledDates, // Передаем занятые дни — они будут заблокированы в календаре
        onChange: function (selectedDates, dateStr) {
          if (dateStr) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
            submitBtn.style.cursor = "pointer";
          } else {
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.5";
            submitBtn.style.cursor = "not-allowed";
          }
        },
      });
    }

    // При изменении мастера очищаем поле даты и пересчитываем доступность дней
    masterSelect.addEventListener("change", () => {
      dateInput.value = "";
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.5";
      submitBtn.style.cursor = "not-allowed";
      updateCalendarAvailability();
    });

    // Первоначальная сборка календаря при открытии окна
    updateCalendarAvailability();

    const cancelBtn = modal.querySelector("#modal-cancel-btn");
    cancelBtn.addEventListener("click", () => {
      if (datepickerInstance) datepickerInstance.destroy();
      modal.remove();
    });

    const form = modal.querySelector("#booking-modal-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const selectedMasterId = masterSelect.value;
      const selectedMasterName =
        masterSelect.options[masterSelect.selectedIndex].text;
      const selectedDate = dateInput.value;

      try {
        const orderData = {
          userId: currentUser.id,
          items: [
            {
              productId: product.productId,
              name: product.name,
              subcategory: product.subcategory || null,
              price: product.price,
              amount: product.amount || 1,
              masterId: selectedMasterId,
              masterName: selectedMasterName,
              bookingDate: selectedDate,
            },
          ],
          date: new Date().toLocaleDateString(),
        };

        const orderRes = await fetch(`http://localhost:3000/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        if (!orderRes.ok) {
          throw new Error("Не удалось создать запись на услугу");
        }

        await fetch(`http://localhost:3000/cart/${product.id}`, {
          method: "DELETE",
        });

        alert("Запись на услугу успешно оформлена!");
        if (datepickerInstance) datepickerInstance.destroy();
        modal.remove();
        loadProduct();
      } catch (error) {
        console.error("Ошибка:", error);
        alert("Произошла ошибка при оформлении записи");
      }
    });
  }

  async function processPurchase(product) {
    const isService =
      product.productId && product.productId.startsWith("service");

    if (isService) {
      showBookingModal(product);
    } else {
      try {
        const orderData = {
          userId: currentUser.id,
          items: [
            {
              productId: product.productId,
              name: product.name,
              price: product.price,
              amount: product.amount || 1,
            },
          ],
          date: new Date().toLocaleDateString(),
        };
        const response = await fetch(`http://localhost:3000/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        if (!response.ok) {
          throw new Error("Не удалось создать заказ в базе");
        }
        await fetch(`http://localhost:3000/cart/${product.id}`, {
          method: "DELETE",
        });
        alert("Покупка товара успешно оформлена!");
        loadProduct();
      } catch (error) {
        console.error("Ошибка:", error);
        alert("Произошла ошибка при оформлении покупки товара");
      }
    }
  }

  async function Delete(product) {
    try {
      const url = await fetch(`http://localhost:3000/cart/${product.id}`, {
        method: "DELETE",
      });
      if (!url.ok) {
        throw new Error("Не удалось удалить товар из корзины");
      }
      alert(`Товар "${product.name}" успешно удален из корзины!`);
      loadProduct();
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Произошла ошибка при удалении из корзины");
    }
  }

  async function UpdateAmount(id, amount) {
    try {
      const response = await fetch(`http://localhost:3000/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount }),
      });
      if (!response.ok) {
        throw new Error("Ошибка при обновлении количества");
      }
      loadProduct();
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }

  loadProduct();
}
