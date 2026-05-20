document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("../backend/db.json");
    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }
    const data = await response.json();

    const services = data.services;
    if (!services || !Array.isArray(services)) {
      console.error("Нет данных services в JSON");
      console.log("Полученные данные:", services);
      return;
    }

    const descriptionBox = document.querySelector(".sign-desription");
    const pricesBox = document.querySelector(".costs-master");
    const menuItems = document.querySelectorAll(".kinds-hairStyle");

    const renderPrices = (items) =>
      items
        .map((item, index) => {
          const gapClass =
            index === 1
              ? "haircut-masterCost1"
              : index === 2
                ? "haircut-masterCost2"
                : "";
          return `
            <div class="with-line">
              <div class="haircut-masterCost ${gapClass}">
                <p class="master-hair">${item.name}</p>
                <p class="cost-hair">${item.price} ₽</p>
              </div>
              <hr class="line-haircut" />
            </div>
          `;
        })
        .join("");

    const updateView = (service, subcategory = null) => {
      const target = subcategory ?? service;

      descriptionBox.innerHTML = `
        <p class="tittle">${target.title}</p>
        <p class="description-hairCut">${target.description ?? ""}</p>
      `;

      if (subcategory?.items) {
        pricesBox.innerHTML = renderPrices(subcategory.items);
      } else {
        const mainItems = [
          { name: service.fromstash, price: service.startingPricestach },
          { name: service.frommast, price: service.startingPricemast },
          { name: service.frompro, price: service.startingPricepro },
        ];
        pricesBox.innerHTML = renderPrices(mainItems);
      }
    };

    const toggleSubcategories = (menuItem, service) => {
      const icon = menuItem.querySelector(".toggle-icon");
      let list = menuItem.querySelector(".subcategories-list");

      menuItems.forEach((other) => {
        if (other !== menuItem) {
          const otherList = other.querySelector(".subcategories-list");
          const otherIcon = other.querySelector(".toggle-icon");
          if (otherList) {
            otherList.classList.remove("open");
            setTimeout(() => otherList?.remove(), 400);
          }
          otherIcon?.classList.remove("rotate");
        }
      });

      icon?.classList.toggle("rotate");

      if (!list) {
        list = document.createElement("ul");
        list.className = "subcategories-list";

        service.subcategories?.forEach((sub) => {
          const li = document.createElement("li");
          li.textContent = sub.title;
          li.addEventListener("click", () => {
            updateView(service, sub);
          });
          list.appendChild(li);
        });

        menuItem.appendChild(list);
        requestAnimationFrame(() => list.classList.add("open"));
      } else {
        list.classList.toggle("open");
        if (!list.classList.contains("open")) {
          setTimeout(() => list.remove(), 400);
        }
      }
    };

    menuItems.forEach((menuItem) => {
      const serviceId = menuItem.dataset.id;
      const service = services.find((s) => s.id === serviceId);

      if (!service) {
        console.warn(`Услуга с id "${serviceId}" не найдена`);
        return;
      }

      const link = menuItem.querySelector(".items-kinds-hair");
      const icon = menuItem.querySelector(".toggle-icon");

      link?.addEventListener("click", (e) => {
        e.preventDefault();
        document
          .querySelectorAll(".items-kinds-hair")
          .forEach((a) => a.classList.remove("active"));
        link.classList.add("active");
        updateView(service);
      });

      // Клик по иконке +
      icon?.addEventListener("click", () => {
        toggleSubcategories(menuItem, service);
      });
    });

    const firstService = services[0];
    const firstLink = document.querySelector(
      `[data-id="${firstService?.id}"] .items-kinds-hair`,
    );

    if (firstLink && firstService) {
      firstLink.classList.add("active");
      updateView(firstService);
    }
  } catch (err) {
    console.error("Ошибка инициализации услуг:", err);
    console.error("💡 Проверьте путь к db.json и структуру данных!");
  }
});
