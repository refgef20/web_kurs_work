const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const section = document.querySelector(".container-for-catalog");

if (!currentUser) {
  section.innerHTML = `
      <div style="text-align: center; margin-top: 50px; color: #fff;">
        <h2>Пожалуйста, авторизуйтесь для просмотра Избранного.</h2>
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
        "<p style='color: #fff;'>Не удалось загрузить избранное.</p>";
    }
  }

  function renderCards(input) {
    container.innerHTML = "";
    if (!input || input.length === 0) {
      container.innerHTML =
        "<p style='color: #fff;'>Список избранного пуст</p>";
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
      text1.textContent = element.name;

      const text2 = document.createElement("p");
      text2.className = "item-first-card-mets1";
      card.appendChild(text2);
      text2.textContent = element.description;

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
  }

  async function Delete(product) {
    try {
      const url = await fetch(`http://localhost:3000/favorites/${product.id}`, {
        method: "DELETE",
      });
      if (!url.ok) {
        throw new Error("Не удалось удалить товар из избранного");
      }
      alert(`Товар "${product.name}" успешно удален из избранного!`);
      loadProduct();
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Произошла ошибка при удалении из избранного");
    }
  }

  loadProduct();
}
