document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("masters-container");
  const btnLeft = document.querySelector(".arrow-left");
  const btnRight = document.querySelector(".arrow-right");

  if (!container || !btnLeft || !btnRight) {
    console.warn("Элементы слайдера мастеров не найдены в DOM.");
    return;
  }

  let masters = [];
  let currentIndex = 0;

  const renderMasters = () => {
    if (!masters.length) return;

    container.innerHTML = Array.from({ length: 3 }, (_, i) => {
      const index = (currentIndex + i) % masters.length;
      const master = masters[index];

      const name = window.getLocalizedValue(master, "name");
      const qualification = window.getLocalizedValue(master, "qualification");
      const expList = window.getLocalizedValue(master, "experience");

      const experienceHTML = Array.isArray(expList)
        ? expList.map((item) => `<p class="item-who">- ${item}</p>`).join("")
        : "";

      return `
        <div class="card">
          <img src="${master.photo}" alt="${name}" />
          <div class="container-review-master">
            <div class="review-master">
              <div class="name-and-who">
                <p class="name">${name}</p>
                <div class="who">
                  ${experienceHTML}
                  <p class="item-who" style="margin-top: 5px; color: #930270; font-weight: bold;"><span data-i18n="main_js.from">от</span> ${master.price} ₽</p>
                </div>
              </div>
              <p class="qualification">${qualification}</p>
            </div>
          </div>
        </div>
      `;
    }).join("");
    window.translatePage();
  };

  const fetchMasters = async () => {
    try {
      const response = await fetch("http://localhost:3000/masters");
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      const data = await response.json();
      masters = data.masters ?? data;

      if (masters?.length > 0) {
        renderMasters();
      }
    } catch (error) {
      console.error("Не удалось загрузить данные мастеров:", error);
    }
  };

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

  window.addEventListener("languageChanged", renderMasters);

  await fetchMasters();
});
