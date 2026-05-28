const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const section = document.querySelector(".container-for-catalog");

if (!currentUser) {
  section.innerHTML = `
       <div style="text-align: center; margin-top: 50px; color: #fff;">
        <h2 data-i18n="cart.please_auth">Пожалуйста, авторизуйтесь для просмотра Избранного.</h2>
        <button class="my-custom-button" onclick="location.href='auth.html'" style="margin-top: 15px; background: #fff;" data-i18n="cart.login_page">Страница входа</button>
      </div>
    `;
} else {
  const container = document.createElement("div");
  container.className = "container-for-catalog-cards";
  section.appendChild(container);

  async function loadProduct() {
    try {
      const response = await fetch(
        `http://localhost:3000/favorites?userId=${currentUser.id}`,
      );
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
      const data = await response.json();
      renderCards(data);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      container.innerHTML =
        "<p style='color: #fff;' data-i18n='catalog.error_loading'>Не удалось загрузить избранное.</p>";
      window.translatePage();
    }
  }

  function renderCards(input) {
    container.innerHTML = "";
    if (!input || input.length === 0) {
      container.innerHTML =
        "<p style='color: #fff;' data-i18n='cart.empty'>Список избранного пуст</p>";
      window.translatePage();
      return;
    }
    input.forEach((element) => {
      const card = document.createElement("div");
      card.className = "container-for-every-card-mets";
      container.appendChild(card);

      const image = document.createElement("img");
      image.className = "acne1";
      card.appendChild(image);
      image.src = element.photo;

      const text1 = document.createElement("p");
      text1.className = "item-first-card-mets";
      card.appendChild(text1);
      text1.textContent = window.getLocalizedValue(element, "name");

      const text2 = document.createElement("p");
      text2.className = "item-first-card-mets1";
      card.appendChild(text2);
      text2.textContent = window.getLocalizedValue(element, "description");

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

      const cost = document.createElement("p");
      cost.className = "itame-for-button-for-last3cardmets1";
      button.appendChild(cost);
      cost.textContent = element.price + " ₽";
    });
    window.translatePage();
  }

  async function Delete(product) {
    try {
      const url = await fetch(`http://localhost:3000/favorites/${product.id}`, {
        method: "DELETE",
      });
      if (!url.ok) {
        throw new Error("Не удалось удалить товар из избранного");
      }
      const localizedName = window.getLocalizedValue(product, "name");
      alert(
        window.getLang() === "ru"
          ? `Товар "${localizedName}" успешно удален из избранного!`
          : `Product "${localizedName}" successfully removed from favorites!`,
      );
      loadProduct();
    } catch (error) {
      console.error("Ошибка:", error);
      alert(
        window.getLang() === "ru"
          ? "Произошла ошибка при удалении из избранного"
          : "An error occurred while removing from favorites",
      );
    }
  }

  // Обновление интерфейса при переключении RU/EN на странице
  window.addEventListener("languageChanged", () => {
    loadProduct();
  });

  loadProduct();
}
