document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Пожалуйста, сначала авторизуйтесь!");
    location.href = "auth.html";
    return;
  }

  if (currentUser.role === "admin") {
    alert("Администраторы не могут оставлять отзывы!");
    location.href = "../main.HTML";
    return;
  }

  const productSelect = document.getElementById("review-product");
  const reviewText = document.getElementById("review-text");
  const charCounter = document.getElementById("char-counter");
  const feedbackSubmitBtn = document.getElementById("feedback-submit-btn");
  const feedbackForm = document.getElementById("feedback-form");

  // Получаем все заказы текущего пользователя
  const ordersResponse = await fetch(
    `http://localhost:3000/orders?userId=${currentUser.id}`,
  );
  const orders = await ordersResponse.json();

  // Собираем уникальные товары и услуги из истории заказов
  const purchasedItems = new Map(); // ID позиции -> Название позиции
  orders.forEach((order) => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item) => {
        if (item.productId && item.name) {
          purchasedItems.set(item.productId, item.name);
        }
      });
    } else if (order.productId && order.name) {
      purchasedItems.set(order.productId, order.name);
    }
  });

  // Заполняем выпадающий список полученными позициями
  purchasedItems.forEach((name, id) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.dataset.name = name;

    // Визуальное разделение товаров и услуг в выпадающем списке
    const isService = id.toString().startsWith("service");
    opt.textContent = isService ? `Услуга ${name}` : `Товар ${name}`;

    productSelect.appendChild(opt);
  });

  if (productSelect.options.length === 1) {
    const opt = document.createElement("option");
    opt.disabled = true;
    opt.textContent = "Вы еще ничего не приобрели!";
    productSelect.appendChild(opt);
  }

  reviewText.addEventListener("input", () => {
    const len = reviewText.value.length;
    charCounter.textContent = `Символов: ${len}`;

    if (len >= 20 && productSelect.value !== "") {
      feedbackSubmitBtn.disabled = false;
    } else {
      feedbackSubmitBtn.disabled = true;
    }
  });

  productSelect.addEventListener("change", () => {
    if (reviewText.value.length >= 20 && productSelect.value !== "") {
      feedbackSubmitBtn.disabled = false;
    } else {
      feedbackSubmitBtn.disabled = true;
    }
  });

  feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedOption = productSelect.options[productSelect.selectedIndex];
    const newFeedback = {
      userId: currentUser.id,
      username: currentUser.username,
      productId: productSelect.value,
      productName: selectedOption.dataset.name,
      text: reviewText.value.trim(),
      date: new Date().toLocaleDateString(),
    };

    try {
      const response = await fetch("http://localhost:3000/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeedback),
      });

      if (!response.ok) throw new Error("Не удалось опубликовать отзыв");

      alert("Отзыв успешно добавлен!");
      location.href = "../main.HTML";
    } catch (err) {
      console.error(err);
      alert("Ошибка при сохранении отзыва.");
    }
  });
});
