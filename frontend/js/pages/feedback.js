document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert(
      window.getLang() === "ru"
        ? "Пожалуйста, сначала авторизуйтесь!"
        : "Please log in first!",
    );
    location.href = "auth.html";
    return;
  }

  if (currentUser.role === "admin") {
    alert(
      window.getLang() === "ru"
        ? "Администраторы не могут оставлять отзывы!"
        : "Administrators cannot leave reviews!",
    );
    location.href = "../main.HTML";
    return;
  }

  const productSelect = document.getElementById("review-product");
  const reviewText = document.getElementById("review-text");
  const charCounter = document.getElementById("char-counter");
  const feedbackSubmitBtn = document.getElementById("feedback-submit-btn");
  const feedbackForm = document.getElementById("feedback-form");

  const ordersResponse = await fetch(
    `http://localhost:3000/orders?userId=${currentUser.id}`,
  );
  const orders = await ordersResponse.json();

  const purchasedItems = new Map();
  orders.forEach((order) => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item) => {
        if (item.productId) {
          purchasedItems.set(item.productId, item);
        }
      });
    }
  });

  const renderProductOptions = () => {
    productSelect.innerHTML = `<option value="" disabled selected data-i18n="feedback.select_placeholder">Выберите купленный продукт</option>`;

    purchasedItems.forEach((item, id) => {
      const opt = document.createElement("option");
      opt.value = id;

      const localizedName = window.getLocalizedValue(item, "name");
      opt.dataset.name_ru = item.name_ru || item.name;
      opt.dataset.name_en = item.name_en || item.name;

      const isService = id.toString().startsWith("service");
      if (window.getLang() === "ru") {
        opt.textContent = isService
          ? `Услуга ${localizedName}`
          : `Товар ${localizedName}`;
      } else {
        opt.textContent = isService
          ? `Service ${localizedName}`
          : `Product ${localizedName}`;
      }

      productSelect.appendChild(opt);
    });

    if (purchasedItems.size === 0) {
      const opt = document.createElement("option");
      opt.disabled = true;
      opt.setAttribute("data-i18n", "feedback.not_purchased_yet");
      productSelect.appendChild(opt);
    }
    window.translatePage();
  };

  renderProductOptions();

  reviewText.addEventListener("input", () => {
    const len = reviewText.value.length;
    charCounter.innerHTML = `<span data-i18n="feedback.symbols">Символов</span>: ${len}`;
    window.translatePage();

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
      productName_ru: selectedOption.dataset.name_ru,
      productName_en: selectedOption.dataset.name_en,
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

      alert(
        window.getLang() === "ru"
          ? "Отзыв успешно добавлен!"
          : "Review successfully published!",
      );
      location.href = "../main.HTML";
    } catch (err) {
      console.error(err);
    }
  });

  window.addEventListener("languageChanged", renderProductOptions);
});
