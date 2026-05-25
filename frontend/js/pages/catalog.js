let currentPage = 1;
const limit = 5;
let totalPages = 1;
const url = new URL(`http://localhost:3000/products`);
url.searchParams.set("_page", currentPage);
url.searchParams.set("_per_page", limit);

async function loadProduct() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }
    const data = await response.json();
    totalPages = data.pages || 1;
    btnPrev.disabled = currentPage <= 1;
    btnNext.disabled = currentPage >= totalPages;
    btnPrev.style.opacity = btnPrev.disabled ? "0.5" : "1";
    btnNext.style.opacity = btnNext.disabled ? "0.5" : "1";
    btnPrev.style.cursor = btnPrev.disabled ? "not-allowed" : "pointer";
    btnNext.style.cursor = btnNext.disabled ? "not-allowed" : "pointer";
    renderCards(data.data);
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    container.innerHTML =
      "<p>Упс! Что-то пошло не так с загрузкой товаров.</p>";
  }
}

function renderCards(input) {
  container.innerHTML = "";
  if (!input || input.length === 0) {
    container.innerHTML = "<p>Товары не найдены</p>";
    return;
  }
  input.forEach((element) => {
    const card = document.createElement("div");
    card.className = "container-for-every-card-mets";
    container.appendChild(card);

    const image = document.createElement("img");
    image.className = "img-prod";
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
    button.className = "container-for-button-catalog";
    card.appendChild(button);

    const fc = document.createElement("div");
    fc.className = "container-for-button-catalog1";
    button.appendChild(fc);

    const text_button = document.createElement("button");
    text_button.className = "button-emo itame-for-button-catalog";
    fc.appendChild(text_button);
    text_button.textContent = "🛒";
    text_button.addEventListener("click", () => {
      AddCart(element);
    });

    const h_button = document.createElement("button");
    h_button.className = "button-emo itame-for-button-catalog";
    h_button.addEventListener("click", () => {
      AddFavorite(element);
    });
    fc.appendChild(h_button);
    h_button.textContent = "❤️";

    const cost = document.createElement("p");
    cost.className = "itame-for-button-for-last3cardmets1";
    button.appendChild(cost);
    cost.textContent = element.price + " ₽";
  });
}

async function AddCart(product) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Пожалуйста, сначала войдите в систему!");
    location.href = "auth.html";
    return;
  }
  try {
    const checkRes = await fetch(
      `http://localhost:3000/cart?userId=${currentUser.id}&productId=${product.id}`,
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
      alert(`Количество товара "${product.name}" в корзине обновлено!`);
    } else {
      const cartItem = {
        userId: currentUser.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        photo: product.photo,
        amount: 1,
      };
      await fetch(`http://localhost:3000/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
      });
      alert(`Товар "${product.name}" добавлен в корзину!`);
    }
  } catch (error) {
    console.error("Ошибка при добавлении в корзину:", error);
  }
}

async function AddFavorite(product) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Пожалуйста, сначала войдите в систему!");
    location.href = "auth.html";
    return;
  }

  try {
    const checkRes = await fetch(
      `http://localhost:3000/favorites?userId=${currentUser.id}&productId=${product.id}`,
    );
    const existing = await checkRes.json();

    if (existing.length > 0) {
      alert(`Товар "${product.name}" уже добавлен в избранное!`);
      return;
    } else {
      const favItem = {
        userId: currentUser.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        photo: product.photo,
      };
      await fetch(`http://localhost:3000/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(favItem),
      });
      alert(`Товар "${product.name}" добавлен в избранное!`);
    }
  } catch (error) {
    console.error("Ошибка при добавлении в избранное:", error);
  }
}

async function sort_cards() {
  try {
    currentPage = 1;
    url.searchParams.set("_sort", "price");
    const response = await fetch(url);
    if (!response.ok) throw new Error("Ошибка загрузки");
    const result = await response.json();
    renderCards(result.data);
  } catch (error) {
    console.error(error);
  }
}

async function nameCards() {
  try {
    url.searchParams.set("_sort", "name");
    const response = await fetch(url);
    if (!response.ok) throw new Error("Ошибка загрузки");
    const result = await response.json();
    renderCards(result.data);
  } catch (error) {
    console.error(error);
  }
}

async function ratingCards() {
  try {
    url.searchParams.set("_sort", "rating");
    const response = await fetch(url);
    if (!response.ok) throw new Error("Ошибка загрузки");
    const result = await response.json();
    renderCards(result.data);
  } catch (error) {
    console.error(error);
  }
}

async function sortCategory(category) {
  try {
    url.searchParams.set("category", category);
    const response = await fetch(url);
    if (!response.ok) throw new Error("Ошибка загрузки");
    const result = await response.json();
    renderCards(result.data);
  } catch (error) {
    console.error(error);
  }
}

function list(list_f) {
  if (list_f == "price" || list_f == "cost") {
    sort_cards();
  }
  if (list_f == "name") {
    nameCards();
  }
  if (list_f == "rating") {
    ratingCards();
  }
}

async function findCard(input) {
  try {
    currentPage = 1;
    url.searchParams.set("_page", currentPage);
    if (input) {
      url.searchParams.set("name:contains", input);
    } else {
      url.searchParams.delete("name:contains");
    }
    const findResult = await fetch(url);
    if (!findResult.ok) throw new Error("Ошибка поиска");
    const result = await findResult.json();
    renderCards(result.data);
  } catch (error) {
    console.error(error);
  }
}

function applyPriceFilter() {
  const min = inputMin.value;
  const max = inputMax.value;
  if (min) url.searchParams.set("price:gte", min);
  else url.searchParams.delete("price:gte");

  if (max) url.searchParams.set("price:lte", max);
  else url.searchParams.delete("price:lte");
  currentPage = 1;
  url.searchParams.set("_page", currentPage);
  loadProduct();
}

const section = document.querySelector(".container-for-catalog");
const buttons = document.createElement("div");
buttons.className = "container-for-buttons";
section.appendChild(buttons);

const find = document.createElement("input");
find.className = "find-card";
find.placeholder = "🔍 Поиск по названию";
find.addEventListener("input", function () {
  findCard(find.value);
});
buttons.appendChild(find);

const list_filter = document.createElement("select");
list_filter.className = "category-filter";
const sort = document.createElement("option");
sort.textContent = "Сортировка";
buttons.appendChild(list_filter);

const button_sort = document.createElement("option");
button_sort.value = "Price";
button_sort.textContent = "По цене";
const button_resort = document.createElement("option");
button_resort.value = "Name";
button_resort.textContent = "По имени";
const button_category = document.createElement("option");
button_category.value = "Rating";
button_category.textContent = "По рейтингу";

list_filter.addEventListener("change", function () {
  const list_f = list_filter.value.toLowerCase();
  list(list_f);
});
list_filter.appendChild(sort);
list_filter.appendChild(button_sort);
list_filter.appendChild(button_resort);
list_filter.appendChild(button_category);

const priceFilterContainer = document.createElement("div");
priceFilterContainer.className = "container-for-buttons";
buttons.appendChild(priceFilterContainer);

const inputMin = document.createElement("input");
inputMin.type = "number";
inputMin.placeholder = "Мин ₽";
inputMin.className = "find-card";
inputMin.style.maxWidth = "120px";

const inputMax = document.createElement("input");
inputMax.type = "number";
inputMax.placeholder = "Макс ₽";
inputMax.className = "find-card";
inputMax.style.maxWidth = "120px";

inputMin.addEventListener("input", applyPriceFilter);
inputMax.addEventListener("input", applyPriceFilter);
priceFilterContainer.appendChild(inputMin);
priceFilterContainer.appendChild(inputMax);

const containernav = document.createElement("ul");
containernav.className = "nav-bar-for-mets";
section.appendChild(containernav);

const hair = document.createElement("li");
hair.classList.add("button-for-nav-second", "item-for-nav-mets-last3");
hair.textContent = "Hair treatment";
hair.style.cursor = "pointer";
hair.addEventListener("click", () => sortCategory("Hair treatment"));
containernav.appendChild(hair);

const care = document.createElement("li");
care.classList.add("button-for-nav-second", "item-for-nav-mets-last3");
care.textContent = "Professional care";
care.style.cursor = "pointer";
care.addEventListener("click", () => sortCategory("Professional care"));
containernav.appendChild(care);

const tools = document.createElement("li");
tools.classList.add("button-for-nav-second", "item-for-nav-mets-last3");
tools.textContent = "Styling tools";
tools.style.cursor = "pointer";
tools.addEventListener("click", () => sortCategory("Styling tools"));
containernav.appendChild(tools);

const daily = document.createElement("li");
daily.classList.add("button-for-nav-second", "item-for-nav-mets-last3");
daily.textContent = "Daily care";
daily.style.cursor = "pointer";
daily.addEventListener("click", () => sortCategory("Daily care"));
containernav.appendChild(daily);

const container = document.createElement("div");
container.className = "container-for-catalog-cards";
section.appendChild(container);

const container_buttonPag = document.createElement("div");
container_buttonPag.className = "container-buttons";
section.appendChild(container_buttonPag);

const btnPrev = document.createElement("button");
btnPrev.textContent = "Назад";
btnPrev.className = "my-custom-button";
btnPrev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    url.searchParams.set("_page", currentPage);
    loadProduct();
  }
});

const btnNext = document.createElement("button");
btnNext.textContent = "Вперед";
btnNext.className = "my-custom-button";
btnNext.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    url.searchParams.set("_page", currentPage);
    loadProduct();
  }
});
container_buttonPag.appendChild(btnPrev);
container_buttonPag.appendChild(btnNext);

loadProduct();
