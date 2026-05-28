document.addEventListener("DOMContentLoaded", async () => {
  // Безопасное определение текущего языка системы
  const getLang = () => localStorage.getItem("lang") || "ru";

  const getLocalizedValue = (obj, key) => {
    if (!obj) return "";
    const lang = getLang();
    const localizedKey = `${key}_${lang}`;
    if (obj[localizedKey] !== undefined && obj[localizedKey] !== null) {
      return obj[localizedKey];
    }
    return obj[key] || "";
  };

  // Безопасное чтение пользователя из localStorage
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
  } catch (e) {
    console.error("Не удалось разобрать данные пользователя:", e);
  }

  if (!currentUser || currentUser.role !== "admin") {
    alert("Доступ запрещен!");
    location.href = "../main.HTML";
    return;
  }

  // Вкладки
  const tabProducts = document.getElementById("tab-products-btn");
  const tabServices = document.getElementById("tab-services-btn");
  const productsSection = document.getElementById("products-admin-section");
  const servicesSection = document.getElementById("services-admin-section");

  if (tabProducts && tabServices && productsSection && servicesSection) {
    tabProducts.addEventListener("click", () => {
      tabProducts.classList.add("active");
      tabServices.classList.remove("active");
      productsSection.classList.remove("hidden");
      servicesSection.classList.add("hidden");
    });

    tabServices.addEventListener("click", () => {
      tabServices.classList.add("active");
      tabProducts.classList.remove("active");
      servicesSection.classList.remove("hidden");
      productsSection.classList.add("hidden");
    });
  }

  // Элементы формы товаров
  const productForm = document.getElementById("product-form");
  const formModeTitle = document.getElementById("form-mode-title");
  const prodIdInput = document.getElementById("prod-id");
  const prodNameInput = document.getElementById("prod-name");
  const prodCostInput = document.getElementById("prod-cost");
  const prodDescInput = document.getElementById("prod-desc");
  const prodCategorySelect = document.getElementById("prod-category");
  const prodPhotoInput = document.getElementById("prod-photo");
  const productSubmitBtn = document.getElementById("product-submit-btn");
  const productsContainer = document.getElementById("admin-products-container");

  // Элементы формы услуг (категорий)
  const serviceForm = document.getElementById("service-form");
  const serviceFormModeTitle = document.getElementById(
    "service-form-mode-title",
  );
  const servIdInput = document.getElementById("serv-id");
  const servTitleInput = document.getElementById("serv-title");
  const servPhotoInput = document.getElementById("serv-photo");
  const servDescInput = document.getElementById("serv-desc");
  const servStashName = document.getElementById("serv-stash-name");
  const servStashPrice = document.getElementById("serv-stash-price");
  const servMastName = document.getElementById("serv-mast-name");
  const servMastPrice = document.getElementById("serv-mast-price");
  const servProName = document.getElementById("serv-pro-name");
  const servProPrice = document.getElementById("serv-pro-price");
  const serviceSubmitBtn = document.getElementById("service-submit-btn");
  const servicesContainer = document.getElementById("admin-services-container");

  const reviewsContainer = document.getElementById("admin-reviews-container");
  const filterByProduct = document.getElementById("filter-by-product");
  const filterByUser = document.getElementById("filter-by-user");

  function showError(input, text) {
    if (!input) return;
    let errorSpan = input.parentNode.querySelector(".error-message");
    if (!errorSpan) {
      errorSpan = document.createElement("span");
      errorSpan.className = "error-message";
      input.parentNode.appendChild(errorSpan);
    }
    errorSpan.setAttribute("data-i18n", text);
    window.translatePage();
    errorSpan.style.display = "block";
  }

  function hideError(input) {
    if (!input) return;
    const errorSpan = input.parentNode.querySelector(".error-message");
    if (errorSpan) {
      errorSpan.style.display = "none";
      errorSpan.removeAttribute("data-i18n");
    }
  }

  // Валидация товаров
  const prodInputs = [
    prodNameInput,
    prodCostInput,
    prodDescInput,
    prodPhotoInput,
  ];
  prodInputs.forEach((el) => {
    if (el) {
      el.addEventListener("input", () => {
        hideError(el);
        validateProductForm();
      });
    }
  });

  function validateProductForm() {
    if (!productForm) return;
    let isValid = true;
    if (!prodNameInput || !prodNameInput.value.trim()) isValid = false;
    const cost = prodCostInput ? parseFloat(prodCostInput.value) : NaN;
    if (isNaN(cost) || cost <= 0) isValid = false;
    if (!prodDescInput || !prodDescInput.value.trim()) isValid = false;
    if (!prodPhotoInput || !prodPhotoInput.value.trim()) isValid = false;

    if (productSubmitBtn) {
      productSubmitBtn.disabled = !isValid;
    }
  }

  // Валидация базовых услуг
  const servInputs = [
    servTitleInput,
    servPhotoInput,
    servDescInput,
    servStashName,
    servStashPrice,
    servMastName,
    servMastPrice,
    servProName,
    servProPrice,
  ];
  servInputs.forEach((el) => {
    if (el) {
      el.addEventListener("input", () => {
        hideError(el);
        validateServiceForm();
      });
    }
  });

  function validateServiceForm() {
    if (!serviceForm) return;
    let isValid = true;
    if (!servTitleInput || !servTitleInput.value.trim()) isValid = false;
    if (!servPhotoInput || !servPhotoInput.value.trim()) isValid = false;
    if (!servDescInput || !servDescInput.value.trim()) isValid = false;

    const stashP = servStashPrice ? parseFloat(servStashPrice.value) : NaN;
    const mastP = servMastPrice ? parseFloat(servMastPrice.value) : NaN;
    const proP = servProPrice ? parseFloat(servProPrice.value) : NaN;

    if (
      !servStashName ||
      !servStashName.value.trim() ||
      isNaN(stashP) ||
      stashP <= 0
    )
      isValid = false;
    if (
      !servMastName ||
      !servMastName.value.trim() ||
      isNaN(mastP) ||
      mastP <= 0
    )
      isValid = false;
    if (!servProName || !servProName.value.trim() || isNaN(proP) || proP <= 0)
      isValid = false;

    if (serviceSubmitBtn) {
      serviceSubmitBtn.disabled = !isValid;
    }
  }

  // Загрузка товаров
  async function loadCatalog() {
    if (!productsContainer) return;
    const response = await fetch("http://localhost:3000/products");
    const products = await response.json();

    productsContainer.innerHTML = "";
    if (filterByProduct) {
      filterByProduct.innerHTML = `<option value="" data-i18n="admin.all_products">Все товары</option>`;
    }

    products.forEach((p) => {
      const localizedName = getLocalizedValue(p, "name");
      const card = document.createElement("div");
      card.className = "prod-card";
      card.innerHTML = `
        <img src="${p.photo}" alt="">
        <h4>${localizedName}</h4>
        <p class="card-price">${p.price} ₽</p>
        <div class="card-actions">
          <button class="edit-btn-style edit-btn" style="position: relative; z-index: 10; pointer-events: auto;" data-i18n="admin.edit_btn">Ред.</button>
          <button class="delete-btn-style delete-btn" style="position: relative; z-index: 10; pointer-events: auto;" data-i18n="admin.delete_btn">Удалить</button>
        </div>
      `;

      card.querySelector(".edit-btn").addEventListener("click", () => {
        if (formModeTitle)
          formModeTitle.textContent = `Редактирование: ${localizedName}`;
        if (prodIdInput) prodIdInput.value = p.id;
        if (prodNameInput) prodNameInput.value = localizedName;
        if (prodCostInput) prodCostInput.value = p.price;
        if (prodDescInput)
          prodDescInput.value = getLocalizedValue(p, "description");
        if (prodCategorySelect) prodCategorySelect.value = p.category;
        if (prodPhotoInput) prodPhotoInput.value = p.photo;
        validateProductForm();
        if (tabProducts) tabProducts.click();
      });

      card.querySelector(".delete-btn").addEventListener("click", async () => {
        if (confirm(`Удалить товар "${localizedName}"?`)) {
          await fetch(`http://localhost:3000/products/${p.id}`, {
            method: "DELETE",
          });
          loadCatalog();
        }
      });

      productsContainer.appendChild(card);

      if (filterByProduct) {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = localizedName;
        filterByProduct.appendChild(opt);
      }
    });

    // Вызов перевода после того, как элементы каталога добавлены в DOM
    window.translatePage();
  }

  // Загрузка услуг
  async function loadServices() {
    if (!servicesContainer) return;
    const response = await fetch("http://localhost:3000/services");
    const services = await response.json();

    servicesContainer.innerHTML = "";

    services.forEach((s) => {
      let subcategoriesHTML = "";
      const localizedTitle = getLocalizedValue(s, "title");

      if (s.subcategories && s.subcategories.length > 0) {
        subcategoriesHTML = `
          <div class="admin-service-subcategories">
            ${s.subcategories
              .map(
                (sub, index) => `
              <div class="admin-subcat-block">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 4px; margin-bottom: 6px;">
                  <p class="admin-subcat-title" style="margin: 0; border: none; padding: 0;">${getLocalizedValue(sub, "title")}</p>
                  <div style="display: flex; gap: 5px;">
                    <button class="edit-sub-inline-btn my-custom-button" data-service-id="${s.id}" data-sub-idx="${index}" style="position: relative; z-index: 10; pointer-events: auto; padding: 2px 8px; font-size: 11px; background: #fff; color: #000; border: 1px solid #fff; cursor: pointer; border-radius: 12px;" data-i18n="admin.edit_btn">Ред.</button>
                    <button class="delete-sub-inline-btn my-custom-button" data-service-id="${s.id}" data-sub-idx="${index}" style="position: relative; z-index: 10; pointer-events: auto; padding: 2px 8px; font-size: 11px; background-color: palevioletred; color: #fff; border: none; cursor: pointer; border-radius: 12px;" data-i18n="admin.del_btn_short">Уд.</button>
                  </div>
                </div>
                <ul class="admin-subcat-items">
                  ${sub.items
                    .map(
                      (item) => `
                    <li>
                      <span>${getLocalizedValue(item, "name")}</span>
                      <span class="admin-price-badge">${item.price} ₽</span>
                    </li>
                  `,
                    )
                    .join("")}
                </ul>
              </div>
            `,
              )
              .join("")}
              <div style="text-align: right; margin-top: 10px;">
                <button class="add-sub-inline-btn my-custom-button" data-service-id="${s.id}" style="position: relative; z-index: 10; pointer-events: auto; padding: 4px 12px; font-size: 11px; background-color: #2ecc71; color: #fff; border: none; cursor: pointer; border-radius: 12px; font-weight: bold;" data-i18n="admin.add_subcat_btn">+ Добавить подкатегорию</button>
              </div>
          </div>
        `;
      } else {
        const defaultStash =
          getLang() === "ru" ? "Услуга у стажёра" : "Service by intern";
        const defaultMast =
          getLang() === "ru" ? "Услуга у мастера" : "Service by master";
        const defaultPro =
          getLang() === "ru" ? "Услуга у профи" : "Service by pro";

        subcategoriesHTML = `
          <div class="admin-service-subcategories">
            <div class="admin-subcat-block">
              <p class="admin-subcat-title" data-i18n="admin.base_tariffs">Базовые тарифы</p>
              <ul class="admin-subcat-items">
                <li>
                  <span>${getLocalizedValue(s, "fromstash") || defaultStash}</span>
                  <span class="admin-price-badge">${s.startingPricestach || s.price || 0} ₽</span>
                </li>
                <li>
                  <span>${getLocalizedValue(s, "frommast") || defaultMast}</span>
                  <span class="admin-price-badge">${s.startingPricemast || s.price || 0} ₽</span>
                </li>
                <li>
                  <span>${getLocalizedValue(s, "frompro") || defaultPro}</span>
                  <span class="admin-price-badge">${s.startingPricepro || s.price || 0} ₽</span>
                </li>
              </ul>
            </div>
            <div style="text-align: right; margin-top: 10px;">
              <button class="add-sub-inline-btn my-custom-button" data-service-id="${s.id}" style="position: relative; z-index: 10; pointer-events: auto; padding: 4px 12px; font-size: 11px; background-color: #7d12af; color: #fff; border: none; cursor: pointer; border-radius: 12px; font-weight: bold;" data-i18n="admin.add_subcat_btn">+ Добавить подкатегорию</button>
            </div>
          </div>
        `;
      }

      const card = document.createElement("div");
      card.className = "prod-card";
      card.innerHTML = `
       <img src="${s.photo}" alt="">
        <h4>${localizedTitle}</h4>
        <p class="card-price">от ${s.startingPricestach} ₽</p>
        ${subcategoriesHTML}
        <div class="card-actions">
          <button class="edit-btn-style edit-serv-btn" style="position: relative; z-index: 10; pointer-events: auto;" data-i18n="admin.edit_category_btn">Ред. Категорию</button>
          <button class="delete-btn-style delete-serv-btn" style="position: relative; z-index: 10; pointer-events: auto;" data-i18n="admin.delete_btn">Удалить</button>
        </div>
      `;

      // Редактирование основной категории
      card.querySelector(".edit-serv-btn").addEventListener("click", () => {
        if (serviceFormModeTitle)
          serviceFormModeTitle.textContent = `Редактирование категории: ${localizedTitle}`;
        if (servIdInput) servIdInput.value = s.id;
        if (servTitleInput) servTitleInput.value = localizedTitle;
        if (servPhotoInput) servPhotoInput.value = s.photo;
        if (servDescInput)
          servDescInput.value = getLocalizedValue(s, "description");
        if (servStashName)
          servStashName.value = getLocalizedValue(s, "fromstash");
        if (servStashPrice) servStashPrice.value = s.startingPricestach;
        if (servMastName) servMastName.value = getLocalizedValue(s, "frommast");
        if (servMastPrice) servMastPrice.value = s.startingPricemast;
        if (servProName) servProName.value = getLocalizedValue(s, "frompro");
        if (servProPrice) servProPrice.value = s.startingPricepro;
        validateServiceForm();

        // Плавная прокрутка к форме редактирования категории
        if (serviceForm) {
          serviceForm.scrollIntoView({ behavior: "smooth" });
        }
      });

      card
        .querySelector(".delete-serv-btn")
        .addEventListener("click", async () => {
          if (
            confirm(
              `Удалить основную услугу "${localizedTitle}" и все её подкатегории?`,
            )
          ) {
            await fetch(`http://localhost:3000/services/${s.id}`, {
              method: "DELETE",
            });
            loadServices();
          }
        });

      // Быстрое добавление подкатегории (+) из карточки (через модальное окно)
      card.querySelectorAll(".add-sub-inline-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const serviceId = btn.getAttribute("data-service-id");
          showSubcategoryModal(serviceId, null);
        });
      });

      // Инлайн-редактирование подкатегории из карточки (через модальное окно)
      card.querySelectorAll(".edit-sub-inline-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const serviceId = btn.getAttribute("data-service-id");
          const subIdx = parseInt(btn.getAttribute("data-sub-idx"));
          showSubcategoryModal(serviceId, subIdx);
        });
      });

      // Инлайн-удаление подкатегории из карточки
      card.querySelectorAll(".delete-sub-inline-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const serviceId = btn.getAttribute("data-service-id");
          const subIdx = parseInt(btn.getAttribute("data-sub-idx"));

          if (confirm("Вы действительно хотите удалить эту подкатегорию?")) {
            try {
              const res = await fetch(
                `http://localhost:3000/services/${serviceId}`,
              );
              const service = await res.json();

              service.subcategories.splice(subIdx, 1);

              await fetch(`http://localhost:3000/services/${serviceId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(service),
              });

              alert("Подкатегория успешно удалена!");
              await loadServices();
            } catch (err) {
              console.error(err);
            }
          }
        });
      });

      servicesContainer.appendChild(card);
    });
    window.translatePage();
  }

  // Динамически создаваемое модальное окно для добавления/редактирования подкатегорий
  async function showSubcategoryModal(serviceId, subIdx = null) {
    try {
      const response = await fetch(
        `http://localhost:3000/services/${serviceId}`,
      );
      const service = await response.json();

      let subcatData = {
        title_ru: "",
        title_en: "",
        items: [
          {
            name_ru: "Служба у стажёра",
            name_en: "Service by intern",
            price: "",
            photo: "",
          },
          {
            name_ru: "Служба у мастера",
            name_en: "Service by master",
            price: "",
            photo: "",
          },
          {
            name_ru: "Служба у профи",
            name_en: "Service by pro",
            price: "",
            photo: "",
          },
        ],
      };

      if (
        subIdx !== null &&
        service.subcategories &&
        service.subcategories[subIdx]
      ) {
        subcatData = JSON.parse(JSON.stringify(service.subcategories[subIdx]));
      }

      // Создаем фон модального окна
      const modalOverlay = document.createElement("div");
      modalOverlay.style.position = "fixed";
      modalOverlay.style.top = "0";
      modalOverlay.style.left = "0";
      modalOverlay.style.width = "100%";
      modalOverlay.style.height = "100%";
      modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
      modalOverlay.style.zIndex = "10000";
      modalOverlay.style.display = "flex";
      modalOverlay.style.justifyContent = "center";
      modalOverlay.style.alignItems = "center";
      modalOverlay.style.padding = "20px";
      modalOverlay.style.boxSizing = "border-box";

      // Контейнер окна с прокруткой
      const modalContent = document.createElement("div");
      modalContent.style.backgroundColor = "#111";
      modalContent.style.border = "1px solid #333";
      modalContent.style.borderRadius = "12px";
      modalContent.style.width = "100%";
      modalContent.style.maxWidth = "550px";
      modalContent.style.maxHeight = "90vh";
      modalContent.style.overflowY = "auto";
      modalContent.style.padding = "25px";
      modalContent.style.boxSizing = "border-box";
      modalContent.style.color = "#fff";
      modalContent.style.fontFamily = "sans-serif";

      const localizedSubcatTitle = getLocalizedValue(subcatData, "title");
      const headerText =
        subIdx === null
          ? "Создать подкатегорию"
          : `Редактирование: ${localizedSubcatTitle}`;

      modalContent.innerHTML = `
        <h2 style="margin-top:0; border-bottom:1px solid #333; padding-bottom:10px; color:#fff; font-size:1.4rem;" data-i18n="${subIdx === null ? "admin.create_product" : "admin.edit_btn"}">${headerText}</h2>
        <form id="dyn-subcat-form" style="display:flex; flex-direction:column; gap:12px; margin-top:15px;">
          
          <div style="display:flex; flex-direction:column; gap:5px;">
            <label style="font-size:13px; color:#aaa;">Название подкатегории (RU) *</label>
            <input type="text" id="dyn-subcat-title-ru" value="${subcatData.title_ru || subcatData.title || ""}" required style="padding:8px; border-radius:6px; border:1px solid #333; background:#222; color:#fff;" />
          </div>
          <div style="display:flex; flex-direction:column; gap:5px;">
            <label style="font-size:13px; color:#aaa;">Название подкатегории (EN) *</label>
            <input type="text" id="dyn-subcat-title-en" value="${subcatData.title_en || subcatData.title || ""}" required style="padding:8px; border-radius:6px; border:1px solid #333; background:#222; color:#fff;" />
          </div>

          <!-- СТАЖЕР -->
          <div style="border-bottom:1px solid #222; margin-top:10px; padding-bottom:3px;">
            <h4 style="margin:0; color:#fff;" data-i18n="admin.tarif_stash">Тариф: Стажёр</h4>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            <div style="display:flex; flex-direction:column; gap:3px;">
              <label style="font-size:11px; color:#aaa;">Название (RU) *</label>
              <input type="text" id="dyn-stash-name-ru" value="${subcatData.items[0]?.name_ru || subcatData.items[0]?.name || ""}" required style="padding:6px; border-radius:4px; border:1px solid #333; background:#222; color:#fff; font-size:12px;" />
            </div>
            <div style="display:flex; flex-direction:column; gap:3px;">
              <label style="font-size:11px; color:#aaa;">Название (EN) *</label>
              <input type="text" id="dyn-stash-name-en" value="${subcatData.items[0]?.name_en || subcatData.items[0]?.name || ""}" required style="padding:6px; border-radius:4px; border:1px solid #333; background:#222; color:#fff; font-size:12px;" />
            </div>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            <div style="display:flex; flex-direction:column; gap:3px;">
              <label style="font-size:11px; color:#aaa;" data-i18n="admin.input_price">Цена (₽) *</label>
              <input type="number" id="dyn-stash-price" value="${subcatData.items[0]?.price || ""}" min="1" required style="padding:6px; border-radius:4px; border:1px solid #333; background:#222; color:#fff; font-size:12px;" />
            </div>
            <div style="display:flex; flex-direction:column; gap:3px;">
              <label style="font-size:11px; color:#aaa;" data-i18n="admin.input_photo">Ссылка на фото *</label>
              <input type="text" id="dyn-stash-photo" value="${subcatData.items[0]?.photo || ""}" required style="padding:6px; border-radius:4px; border:1px solid #333; background:#222; color:#fff; font-size:12px;" />
            </div>
          </div>

          <!-- МАСТЕР -->
          <div style="border-bottom:1px solid #222; margin-top:10px; padding-bottom:3px;">
            <h4 style="margin:0; color:#fff;" data-i18n="admin.tarif_mast">Тариф: Мастер</h4>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            <div style="display:flex; flex-direction:column; gap:3px;">
              <label style="font-size:11px; color:#aaa;">Название (RU) *</label>
              <input type="text" id="dyn-mast-name-ru" value="${subcatData.items[1]?.name_ru || subcatData.items[1]?.name || ""}" required style="padding:6px; border-radius:4px; border:1px solid #333; background:#222; color:#fff; font-size:12px;" />
            </div>
            <div style="display:flex; flex-direction:column; gap:3px;">
              <label style="font-size:11px; color:#aaa;">Название (EN) *</label>
              <input type="text" id="dyn-mast-name-en" value="${subcatData.items[1]?.name_en || subcatData.items[1]?.name || ""}" required style="padding:6px; border-radius:4px; border:1px solid #333; background:#222; color:#fff; font-size:12px;" />
            </div>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            <div style="display:flex; flex-direction:column; gap:3px;">
              <label style="font-size:11px; color:#aaa;" data-i18n="admin.input_price">Цена (₽) *</label>
              <input type="number" id="dyn-mast-price" value="${subcatData.items[1]?.price || ""}" min="1" required style="padding:6px; border-radius:4px; border:1px solid #333; background:#222; color:#fff; font-size:12px;" />
            </div>
            <div style="display:flex; flex-direction:column; gap:3px;">
              <label style="font-size:11px; color:#aaa;" data-i18n="admin.input_photo">Ссылка на фото *</label>
              <input type="text" id="dyn-mast-photo" value="${subcatData.items[1]?.photo || ""}" required style="padding:6px; border-radius:4px; border:1px solid #333; background:#222; color:#fff; font-size:12px;" />
            </div>
          </div>

          <!-- ПРОФИ -->
          <div style="border-bottom:1px solid #222; margin-top:10px; padding-bottom:3px;">
            <h4 style="margin:0; color:#fff;" data-i18n="admin.tarif_pro">Тариф: Профи</h4>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            <div style="display:flex; flex-direction:column; gap:3px;">
              <label style="font-size:11px; color:#aaa;">Название (RU) *</label>
              <input type="text" id="dyn-pro-name-ru" value="${subcatData.items[2]?.name_ru || subcatData.items[2]?.name || ""}" required style="padding:6px; border-radius:4px; border:1px solid #333; background:#222; color:#fff; font-size:12px;" />
            </div>
            <div style="display:flex; flex-direction:column; gap:3px;">
              <label style="font-size:11px; color:#aaa;">Название (EN) *</label>
              <input type="text" id="dyn-pro-name-en" value="${subcatData.items[2]?.name_en || subcatData.items[2]?.name || ""}" required style="padding:6px; border-radius:4px; border:1px solid #333; background:#222; color:#fff; font-size:12px;" />
            </div>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            <div style="display:flex; flex-direction:column; gap:3px;">
              <label style="font-size:11px; color:#aaa;" data-i18n="admin.input_price">Цена (₽) *</label>
              <input type="number" id="dyn-pro-price" value="${subcatData.items[2]?.price || ""}" min="1" required style="padding:6px; border-radius:4px; border:1px solid #333; background:#222; color:#fff; font-size:12px;" />
            </div>
            <div style="display:flex; flex-direction:column; gap:3px;">
              <label style="font-size:11px; color:#aaa;" data-i18n="admin.input_photo">Ссылка на фото *</label>
              <input type="text" id="dyn-pro-photo" value="${subcatData.items[2]?.photo || ""}" required style="padding:6px; border-radius:4px; border:1px solid #333; background:#222; color:#fff; font-size:12px;" />
            </div>
          </div>

          <div style="display:flex; gap:10px; margin-top:15px;">
            <button type="submit" style="flex:1; padding:10px; border:none; border-radius:6px; background:#2ecc71; color:#fff; font-weight:bold; cursor:pointer;" data-i18n="admin.save">Сохранить</button>
            <button type="button" id="dyn-cancel-btn" style="padding:10px 20px; border:1px solid #444; border-radius:6px; background:#222; color:#fff; cursor:pointer;" data-i18n="admin.cancel">Отмена</button>
          </div>
        </form>
      `;

      modalOverlay.appendChild(modalContent);
      document.body.appendChild(modalOverlay);

      // Запрещаем прокрутку фона страницы
      document.body.style.overflow = "hidden";

      const closeModal = () => {
        document.body.removeChild(modalOverlay);
        document.body.style.overflow = "auto";
      };

      modalContent
        .querySelector("#dyn-cancel-btn")
        .addEventListener("click", closeModal);

      modalContent
        .querySelector("#dyn-subcat-form")
        .addEventListener("submit", async (event) => {
          event.preventDefault();

          const newSubcat = {
            title_ru: document
              .getElementById("dyn-subcat-title-ru")
              .value.trim(),
            title_en: document
              .getElementById("dyn-subcat-title-en")
              .value.trim(),
            items: [
              {
                name_ru: document
                  .getElementById("dyn-stash-name-ru")
                  .value.trim(),
                name_en: document
                  .getElementById("dyn-stash-name-en")
                  .value.trim(),
                price: parseFloat(
                  document.getElementById("dyn-stash-price").value,
                ),
                photo: document.getElementById("dyn-stash-photo").value.trim(),
              },
              {
                name_ru: document
                  .getElementById("dyn-mast-name-ru")
                  .value.trim(),
                name_en: document
                  .getElementById("dyn-mast-name-en")
                  .value.trim(),
                price: parseFloat(
                  document.getElementById("dyn-mast-price").value,
                ),
                photo: document.getElementById("dyn-mast-photo").value.trim(),
              },
              {
                name_ru: document
                  .getElementById("dyn-pro-name-ru")
                  .value.trim(),
                name_en: document
                  .getElementById("dyn-pro-name-en")
                  .value.trim(),
                price: parseFloat(
                  document.getElementById("dyn-pro-price").value,
                ),
                photo: document.getElementById("dyn-pro-photo").value.trim(),
              },
            ],
          };

          if (!service.subcategories) {
            service.subcategories = [];
          }

          if (subIdx === null) {
            service.subcategories.push(newSubcat);
          } else {
            service.subcategories[subIdx] = newSubcat;
          }

          try {
            await fetch(`http://localhost:3000/services/${serviceId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(service),
            });

            alert(
              subIdx === null
                ? "Подкатегория добавлена!"
                : "Подкатегория обновлена!",
            );
            closeModal();
            await loadServices();
          } catch (err) {
            console.error(err);
            alert("Ошибка сохранения!");
          }
        });
    } catch (err) {
      console.error(err);
    }
    window.translatePage();
  }

  // Добавление / Редактирование товаров
  if (productForm) {
    productForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const costValue = parseFloat(prodCostInput.value);
      const editId = prodIdInput.value;
      const currentLang = getLang();

      let productData = {
        price: costValue,
        category: prodCategorySelect.value,
        photo: prodPhotoInput.value.trim(),
        rating: 5.0,
      };

      if (editId) {
        try {
          const res = await fetch(`http://localhost:3000/products/${editId}`);
          if (res.ok) {
            const existingProduct = await res.json();
            productData = { ...existingProduct, ...productData };
          }
        } catch (err) {
          console.error("Ошибка при получении редактируемого товара:", err);
        }
      }

      productData[`name_${currentLang}`] = prodNameInput.value.trim();
      productData[`description_${currentLang}`] = prodDescInput.value.trim();

      if (!editId) {
        productData.name_ru = prodNameInput.value.trim();
        productData.name_en = prodNameInput.value.trim();
        productData.description_ru = prodDescInput.value.trim();
        productData.description_en = prodDescInput.value.trim();
      }

      try {
        if (editId) {
          await fetch(`http://localhost:3000/products/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
          });
          alert("Товар обновлен!");
        } else {
          await fetch(`http://localhost:3000/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
          });
          alert("Товар успешно добавлен в систему!");
        }

        productForm.reset();
        prodIdInput.value = "";
        formModeTitle.textContent = "Создать новый товар";
        productSubmitBtn.disabled = true;
        loadCatalog();
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Добавление / Редактирование базовых услуг
  if (serviceForm) {
    serviceForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const editId = servIdInput.value;
      const currentLang = getLang();
      let existingSubcategories = [];
      let serviceData = {};

      if (editId) {
        try {
          const getRes = await fetch(
            `http://localhost:3000/services/${editId}`,
          );
          if (getRes.ok) {
            serviceData = await getRes.json();
            existingSubcategories = serviceData.subcategories || [];
          }
        } catch (err) {
          console.error("Ошибка получения подкатегорий:", err);
        }
      }

      serviceData = {
        ...serviceData,
        photo: servPhotoInput.value.trim(),
        startingPricestach: parseFloat(servStashPrice.value),
        startingPricemast: parseFloat(servMastPrice.value),
        startingPricepro: parseFloat(servProPrice.value),
        subcategories: existingSubcategories,
      };

      serviceData[`title_${currentLang}`] = servTitleInput.value.trim();
      serviceData[`description_${currentLang}`] = servDescInput.value.trim();
      serviceData[`fromstash_${currentLang}`] = servStashName.value.trim();
      serviceData[`frommast_${currentLang}`] = servMastName.value.trim();
      serviceData[`frompro_${currentLang}`] = servProName.value.trim();

      if (!editId) {
        serviceData.title_ru = servTitleInput.value.trim();
        serviceData.title_en = servTitleInput.value.trim();
        serviceData.description_ru = servDescInput.value.trim();
        serviceData.description_en = servDescInput.value.trim();
        serviceData.fromstash_ru = servStashName.value.trim();
        serviceData.fromstash_en = servStashName.value.trim();
        serviceData.frommast_ru = servMastName.value.trim();
        serviceData.frommast_en = servMastName.value.trim();
        serviceData.frompro_ru = servProName.value.trim();
        serviceData.frompro_en = servProName.value.trim();
      }

      try {
        if (editId) {
          await fetch(`http://localhost:3000/services/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(serviceData),
          });
          alert("Услуга обновлена!");
        } else {
          serviceData.id = servTitleInput.value
            .toLowerCase()
            .replace(/[^a-z0-9]/gi, "_");
          await fetch(`http://localhost:3000/services`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(serviceData),
          });
          alert("Услуга успешно добавлена в систему!");
        }

        serviceForm.reset();
        servIdInput.value = "";
        serviceFormModeTitle.textContent = "Создать новую услугу";
        serviceSubmitBtn.disabled = true;
        loadServices();
      } catch (err) {
        console.error(err);
      }
    });
  }

  async function loadUsers() {
    if (!filterByUser) return;
    const response = await fetch("http://localhost:3000/users?role=client");
    const clients = await response.json();

    // Добавлен data-i18n="admin.all_users" для перевода "Все клиенты"
    filterByUser.innerHTML = `<option value="" data-i18n="admin.all_users">Все клиенты</option>`;

    clients.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = `@${c.username} (${c.firstName} ${c.lastName})`;
      filterByUser.appendChild(opt);
    });

    // Вызов перевода после того, как элементы добавлены в DOM
    window.translatePage();
  }

  async function loadReviews() {
    if (!reviewsContainer) return;
    const url = new URL("http://localhost:3000/feedback");
    const prodVal = filterByProduct ? filterByProduct.value : "";
    const userVal = filterByUser ? filterByUser.value : "";

    if (prodVal) url.searchParams.set("productId", prodVal);
    if (userVal) url.searchParams.set("userId", userVal);

    const response = await fetch(url);
    const reviews = await response.json();

    reviewsContainer.innerHTML = "";
    if (reviews.length === 0) {
      reviewsContainer.innerHTML =
        "<p style='color:#fff;' data-i18n='admin.reviews_not_found'>Отзывов не найдено.</p>";
      window.translatePage();
      return;
    }

    reviews.forEach((r) => {
      const localizedProductName = getLocalizedValue(r, "productName");
      const item = document.createElement("div");
      item.className = "feedback-item";
      item.style.background = "#222";
      item.style.padding = "15px";
      item.style.borderRadius = "12px";
      item.style.display = "flex";
      item.style.justifyContent = "space-between";
      item.style.alignItems = "center";
      item.innerHTML = `
            <div style="color:#fff;">
          <p><strong data-i18n="admin.filter_product">Товар:</strong> ${localizedProductName}</p>
          <p><strong data-i18n="admin.filter_user">Автор:</strong> @${r.username}</p>
          <p style="margin: 6px 0; font-style: italic;">"${r.text}"</p>
          <small style="color: #888;">Дата: ${r.date}</small>
        </div>
        <button class="my-custom-button delete-feed-btn" style="background-color: palevioletred; color: white; border:none; cursor:pointer; padding:5px 10px;" data-i18n="admin.delete_btn">Удалить</button>
      `;

      item
        .querySelector(".delete-feed-btn")
        .addEventListener("click", async () => {
          if (confirm("Вы действительно хотите удалить этот отзыв?")) {
            await fetch(`http://localhost:3000/feedback/${r.id}`, {
              method: "DELETE",
            });
            loadReviews();
          }
        });

      reviewsContainer.appendChild(item);
    });
    window.translatePage();
  }

  if (filterByProduct) {
    filterByProduct.addEventListener("change", loadReviews);
  }
  if (filterByUser) {
    filterByUser.addEventListener("change", loadReviews);
  }

  window.addEventListener("languageChanged", () => {
    loadCatalog();
    loadServices();
    loadReviews();
  });

  // Безопасный запуск независимых процессов инициализации данных
  try {
    await loadCatalog();
  } catch (err) {
    console.error("Ошибка инициализации каталога товаров:", err);
  }

  try {
    await loadServices();
  } catch (err) {
    console.error("Ошибка инициализации каталога услуг:", err);
  }

  try {
    await loadUsers();
  } catch (err) {
    console.error("Ошибка инициализации пользователей:", err);
  }

  try {
    await loadReviews();
  } catch (err) {
    console.error("Ошибка инициализации отзывов:", err);
  }
});
