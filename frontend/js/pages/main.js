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
      return;
    }

    const descriptionBox = document.querySelector(".sign-desription");
    const pricesBox = document.querySelector(".costs-master");
    const menuItems = document.querySelectorAll(".kinds-hairStyle");

    let activeService = services[0];
    let activeSubcategory = null;

    async function AddToCart(product) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        alert(
          window.getLang() === "ru"
            ? "Пожалуйста, сначала авторизуйтесь!"
            : "Please log in first!",
        );
        location.href = "pages/auth.html";
        return;
      }

      try {
        const checkRes = await fetch(
          `http://localhost:3000/cart?userId=${currentUser.id}&productId=${encodeURIComponent("service_" + product.id)}`,
        );
        const existing = await checkRes.json();

        if (existing.length > 0) {
          const item = existing[0];
          const updatedAmount = (item.amount || 1) + 1;
          await fetch(`http://localhost:3000/cart/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: updatedAmount }),
          });
          alert(
            window.getLang() === "ru"
              ? `Количество услуги в корзине обновлено!`
              : `Service quantity in cart updated!`,
          );
        } else {
          const cartItem = {
            userId: currentUser.id,
            productId: "service_" + product.id,
            name_ru: product.name_ru || product.name,
            name_en: product.name_en || product.name,
            subcategory_ru: product.subcategory_ru || null,
            subcategory_en: product.subcategory_en || null,
            price: product.price,
            description_ru: "Услуга салона красоты Annetka.Hair",
            description_en: "Beauty salon service Annetka.Hair",
            photo:
              product.photo ||
              "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
            amount: 1,
          };
          await fetch(`http://localhost:3000/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cartItem),
          });
          alert(
            window.getLang() === "ru"
              ? `Услуга добавлена в корзину!`
              : `Service added to cart!`,
          );
        }
      } catch (error) {
        console.error("Ошибка при добавлении в корзину:", error);
      }
    }

    async function AddToFavorite(product) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        alert(
          window.getLang() === "ru"
            ? "Пожалуйста, сначала авторизуйтесь!"
            : "Please log in first!",
        );
        location.href = "pages/auth.html";
        return;
      }

      try {
        const checkRes = await fetch(
          `http://localhost:3000/favorites?userId=${currentUser.id}&productId=${encodeURIComponent("service_" + product.id)}`,
        );
        const existing = await checkRes.json();

        if (existing.length > 0) {
          alert(
            window.getLang() === "ru"
              ? `Услуга уже добавлена в избранное!`
              : `Service is already in favorites!`,
          );
          return;
        }

        const favItem = {
          userId: currentUser.id,
          productId: "service_" + product.id,
          name_ru: product.name_ru || product.name,
          name_en: product.name_en || product.name,
          subcategory_ru: product.subcategory_ru || null,
          subcategory_en: product.subcategory_en || null,
          price: product.price,
          description_ru: "Услуга салона красоты Annetka.Hair",
          description_en: "Beauty salon service Annetka.Hair",
          photo:
            product.photo ||
            "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
        };

        await fetch(`http://localhost:3000/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(favItem),
        });
        alert(
          window.getLang() === "ru"
            ? `Услуга добавлена в избранное!`
            : `Service added to favorites!`,
        );
      } catch (error) {
        console.error("Ошибка при добавлении в избранное:", error);
      }
    }

    const renderPrices = (items) =>
      items
        .map((item, index) => {
          const gapClass =
            index === 1
              ? "haircut-masterCost1"
              : index === 2
                ? "haircut-masterCost2"
                : "";

          const safeItem = encodeURIComponent(JSON.stringify(item));
          const hasSubcategory = item.subcategory_ru || item.subcategory_en;

          const actionButtons = hasSubcategory
            ? `
              <div class="buttons-row">
                <button class="btn-cart" data-item="${safeItem}" style="cursor:pointer;background:transparent">🛒</button>
                <button class="btn-fav" data-item="${safeItem}" style="cursor:pointer;background:none;">❤️</button>
              </div>
            `
            : "";

          return `
              <div class="with-line">
              <div class="haircut-masterCost ${gapClass}">
                <p class="master-hair">${window.getLocalizedValue(item, "name")}</p>
                <div class="price-and-buttons">
                  <p class="cost-hair">${item.price} ₽</p>
                  ${actionButtons}
                </div>
              </div>
              <hr class="line-haircut" />
            </div>
          `;
        })
        .join("");

    const updateView = (service, subcategory = null) => {
      activeService = service;
      activeSubcategory = subcategory;

      const target = subcategory ?? service;
      descriptionBox.innerHTML = `
        <p class="tittle">${window.getLocalizedValue(target, "title")}</p>
        <p class="description-hairCut">${window.getLocalizedValue(target, "description")}</p>
      `;

      if (subcategory?.items) {
        const subTitleRu = subcategory.title_ru || subcategory.title;
        const subTitleEn = subcategory.title_en || subcategory.title;

        const subcatItems = subcategory.items.map((item, index) => ({
          id: `${service.id}_sub_${index}`,
          name_ru: item.name_ru || item.name,
          name_en: item.name_en || item.name,
          subcategory_ru: subTitleRu,
          subcategory_en: subTitleEn,
          price: item.price,
          photo: item.photo,
        }));
        pricesBox.innerHTML = renderPrices(subcatItems);
      } else {
        const mainItems = [
          {
            id: `${service.id}_stash`,
            name_ru: service.fromstash_ru || service.fromstash,
            name_en: service.fromstash_en || service.fromstash,
            price: service.startingPricestach,
            photo: service.photo,
          },
          {
            id: `${service.id}_mast`,
            name_ru: service.frommast_ru || service.frommast,
            name_en: service.frommast_en || service.frommast,
            price: service.startingPricemast,
            photo: service.photo,
          },
          {
            id: `${service.id}_pro`,
            name_ru: service.frompro_ru || service.frompro,
            name_en: service.frompro_en || service.frompro,
            price: service.startingPricepro,
            photo: service.photo,
          },
        ];
        pricesBox.innerHTML = renderPrices(mainItems);
      }
      attachButtonListeners();
      window.translatePage();
    };

    function attachButtonListeners() {
      pricesBox.querySelectorAll(".btn-cart").forEach((btn) => {
        btn.addEventListener("click", () => {
          const item = JSON.parse(decodeURIComponent(btn.dataset.item));
          AddToCart(item);
        });
      });

      pricesBox.querySelectorAll(".btn-fav").forEach((btn) => {
        btn.addEventListener("click", () => {
          const item = JSON.parse(decodeURIComponent(btn.dataset.item));
          AddToFavorite(item);
        });
      });
    }

    const toggleSubcategories = (menuItem, service) => {
      const icon = menuItem.querySelector(".toggle-icon");
      document
        .querySelectorAll(".subcategories-list")
        .forEach((list) => list.remove());
      menuItems.forEach((item) =>
        item.querySelector(".toggle-icon")?.classList.remove("rotate"),
      );

      const isActive = menuItem.classList.contains("active-category");

      if (!isActive) {
        menuItems.forEach((item) => item.classList.remove("active-category"));
        menuItem.classList.add("active-category");
        icon?.classList.add("rotate");

        const list = document.createElement("ul");
        list.className = "subcategories-list";

        service.subcategories?.forEach((sub) => {
          const li = document.createElement("li");
          li.textContent = window.getLocalizedValue(sub, "title");
          li.addEventListener("click", () => updateView(service, sub));
          list.appendChild(li);
        });

        menuItem.insertAdjacentElement("afterend", list);
        requestAnimationFrame(() => list.classList.add("open"));
      } else {
        menuItem.classList.remove("active-category");
        icon?.classList.remove("rotate");
      }
    };

    menuItems.forEach((menuItem) => {
      const serviceId = menuItem.dataset.id;
      const service = services.find((s) => s.id === serviceId);

      if (!service) return;

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

      icon?.addEventListener("click", () =>
        toggleSubcategories(menuItem, service),
      );
    });

    const firstService = services[0];
    const firstLink = document.querySelector(
      `[data-id="${firstService?.id}"] .items-kinds-hair`,
    );

    if (firstLink && firstService) {
      firstLink.classList.add("active");
      updateView(firstService);
    }

    window.addEventListener("languageChanged", () => {
      updateView(activeService, activeSubcategory);
    });
  } catch (err) {
    console.error("Ошибка инициализации услуг:", err);
  }
});
