document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("masters-container");
  const btnLeft = document.querySelector(".arrow-left");
  const btnRight = document.querySelector(".arrow-right");

  // Безопасная проверка наличия элементов в DOM
  if (!container || !btnLeft || !btnRight) {
    console.warn("Элементы слайдера мастеров не найдены в DOM.");
    return;
  }

  let masters = [];
  let currentIndex = 0;

  // Декларативная отрисовка карточек
  const renderMasters = () => {
    if (!masters.length) return;

    // Создаем массив из 3 элементов и сразу маппим его в HTML-строку
    container.innerHTML = Array.from({ length: 3 }, (_, i) => {
      const index = (currentIndex + i) % masters.length;

      // Деструктуризация свойств объекта мастера
      const { name, photo, experience, price, qualification } = masters[index];

      // Безопасный рендеринг списка опыта с помощью опциональной цепочки
      const experienceHTML =
        experience
          ?.map((item) => `<p class="item-who">- ${item}</p>`)
          .join("") ?? "";

      return `
        <div class="card">
          <img src="${photo}" alt="${name}" />
          <div class="container-review-master">
            <div class="review-master">
              <div class="name-and-who">
                <p class="name">${name}</p>
                <div class="who">
                  ${experienceHTML}
                  <p class="item-who" style="margin-top: 5px; color: #930270; font-weight: bold;">от ${price} ₽</p>
                </div>
              </div>
              <p class="qualification">${qualification}</p>
            </div>
          </div>
        </div>
      `;
    }).join("");
  };

  // Асинхронная загрузка данных
  const fetchMasters = async () => {
    try {
      const response = await fetch("http://localhost:3000/masters");

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const data = await response.json();

      // Извлекаем массив мастеров (поддержка формата json-server и статического файла)
      masters = data.masters ?? data;

      if (masters?.length > 0) {
        renderMasters();
      }
    } catch (error) {
      console.error("Не удалось загрузить данные мастеров:", error);
    }
  };

  // Навешивание слушателей событий
  btnLeft.addEventListener("click", () => {
    if (!masters.length) return;
    currentIndex = (currentIndex - 1 + masters.length) % masters.length;
    renderMasters();
  });

  btnRight.addEventListener("click", () => {
    if (!masters.length) return;
    currentIndex = (currentIndex + 1) % masters.length;
    renderMasters();
  });

  // Запуск асинхронной инициализации
  await fetchMasters();
});
