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

    async function AddToCart(product) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        alert("Пожалуйста, сначала авторизуйтесь!");
        location.href = "pages/auth.html";
        return;
      }

      try {
        const checkRes = await fetch(
          `http://localhost:3000/cart?userId=${currentUser.id}&name=${encodeURIComponent(product.name)}`,
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
          alert(`Количество услуги "${product.name}" в корзине обновлено!`);
        } else {
          const cartItem = {
            userId: currentUser.id,
            productId:
              "service_" +
              product.name.toLowerCase().replace(/[^a-z0-9]/gi, "_"),
            name: product.name,
            subcategory: product.subcategory || null, // Сохранение подкатегории в БД
            price: product.price,
            description: "Услуга салона красоты Annetka.Hair",
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
          alert(`Услуга "${product.name}" добавлена в корзину!`);
        }
      } catch (error) {
        console.error("Ошибка при добавлении в корзину:", error);
      }
    }

    async function AddToFavorite(product) {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        alert("Пожалуйста, сначала авторизуйтесь!");
        location.href = "pages/auth.html";
        return;
      }

      try {
        const checkRes = await fetch(
          `http://localhost:3000/favorites?userId=${currentUser.id}&name=${encodeURIComponent(product.name)}`,
        );
        const existing = await checkRes.json();

        if (existing.length > 0) {
          alert(`Услуга "${product.name}" уже добавлена в избранное!`);
          return;
        }

        const favItem = {
          userId: currentUser.id,
          productId:
            "service_" + product.name.toLowerCase().replace(/[^a-z0-9]/gi, "_"),
          name: product.name,
          subcategory: product.subcategory || null, // Сохранение подкатегории в БД
          price: product.price,
          description: "Услуга салона красоты Annetka.Hair",
          photo:
            product.photo ||
            "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
        };

        await fetch(`http://localhost:3000/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(favItem),
        });
        alert(`Услуга "${product.name}" добавлена в избранное!`);
      } catch (error) {
        console.error("Ошибка при добавлении в избранное:", error);
      }
    }

    const renderPrices = (items, subcategoryName = null) =>
      items
        .map((item, index) => {
          const gapClass =
            index === 1
              ? "haircut-masterCost1"
              : index === 2
                ? "haircut-masterCost2"
                : "";

          // Привязываем подкатегорию к объекту услуги перед кодированием в data-атрибут
          const itemData = { ...item, subcategory: subcategoryName };
          const safeItem = encodeURIComponent(JSON.stringify(itemData));

          // Если подкатегория не выбрана (subcategoryName === null), кнопки корзины и избранного скрываются (не рендерятся)
          const actionButtons = subcategoryName
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
                <p class="master-hair">${item.name}</p>
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
      const target = subcategory ?? service;
      descriptionBox.innerHTML = `
        <p class="tittle">${target.title}</p>
        <p class="description-hairCut">${target.description ?? ""}</p>
      `;

      if (subcategory?.items) {
        // Передаем название выбранной подкатегории
        pricesBox.innerHTML = renderPrices(
          subcategory.items,
          subcategory.title,
        );
      } else {
        const mainItems = [
          {
            name: service.fromstash,
            price: service.startingPricestach,
            photo: service.photo,
          },
          {
            name: service.frommast,
            price: service.startingPricemast,
            photo: service.photo,
          },
          {
            name: service.frompro,
            price: service.startingPricepro,
            photo: service.photo,
          },
        ];
        // Подкатегория не выбрана — передаем null, кнопки будут скрыты
        pricesBox.innerHTML = renderPrices(mainItems, null);
      }
      attachButtonListeners();
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
          li.textContent = sub.title;
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
  } catch (err) {
    console.error("Ошибка инициализации услуг:", err);
  }
});
