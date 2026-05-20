let currentPage = 1;
const limit = 5;
const url = new URL(`http://localhost:3000/products`);
url.searchParams.set("_page", currentPage);
url.searchParams.set("_per_page", limit);

async function loadProduct() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Ошибка сервера:${response.status}");
    }
    const data = await response.json();

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
    cost.textContent = element.cost + "P";
  });
}
async function AddCart(product) {
  try {
    const url = await fetch(`http://localhost:3000/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (!url.ok) {
      throw new Error("Не удалось добавить товар в корзину");
    }
    const res = await url.json();
    alert(`Товар "${product.name}" добавлен в корзину!`);
  } catch (error) {
    console.error("Ошибка:", error);
    alert("Произошла ошибка при добавлении в корзину");
  }
}
async function AddFavorite(product) {
  try {
    const url = await fetch(`http://localhost:3000/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (!url.ok) {
      throw new Error("Не удалось добавить товар в корзину");
    }
    const res = await url.json();
    alert(`Товар "${product.name}" добавлен в избранное!`);
  } catch (error) {
    console.error("Ошибка:", error);
    alert("Произошла ошибка при добавлении в избранное");
  }
}
async function sort_cards() {
  try {
    const params = { _sort: "cost" };

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const sortCost = await fetch(url);

    if (!sortCost.ok) {
      throw new Error("Ошибка сервера:${sortCost.status}");
    }
    const result = await sortCost.json();
    renderCards(result.data);
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    container.innerHTML =
      "<p>Упс! Что-то пошло не так с загрузкой товаров.</p>";
  }
}
async function nameCards() {
  try {
    const params = { _sort: "name" };
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    const sortName = await fetch(url);
    if (!sortName.ok) {
      throw new Error("Ошибка сервера:${sortName.status}");
    }
    const result = await sortName.json();
    renderCards(result.data);
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    container.innerHTML =
      "<p>Упс! Что-то пошло не так с загрузкой товаров.</p>";
  }
}
async function ratingCards() {
  try {
    const params = { _sort: "rating" };
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    const sortRating = await fetch(url);
    if (!sortRating.ok) {
      throw new Error("Ошибка сервера:${sortName.status}");
    }
    const result = await sortRating.json();
    renderCards(result.data);
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    container.innerHTML =
      "<p>Упс! Что-то пошло не так с загрузкой товаров.</p>";
  }
}
async function sortCategory(category) {
  try {
    const params = { category: category };
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    const sortCategory = await fetch(url);

    if (!sortCategory.ok) {
      throw new Error("Ошибка сервера:${sortCategory.status}");
    }
    const result = await sortCategory.json();
    renderCards(result.data);
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    container.innerHTML =
      "<p>Упс! Что-то пошло не так с загрузкой товаров.</p>";
  }
}
function list(list_f) {
  if (list_f == "cost") {
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
    const params = {
      _where: JSON.stringify({
        or: [
          { name: { contains: input } },
          { description: { contains: input } },
        ],
      }),
    };
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    const findResult = await fetch(url);
    if (!findResult.ok) {
      throw new Error("Ошибка сервера:${findResult.status}");
    }
    const result = await findResult.json();

    renderCards(result.data);
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    container.innerHTML =
      "<p>Упс! Что-то пошло не так с загрузкой товаров.</p>";
  }
}

function applyPriceFilter() {
  const min = inputMin.value;
  const max = inputMax.value;
  if (min) url.searchParams.set("cost:gte", min);
  else url.searchParams.delete("cost:gte");

  if (max) url.searchParams.set("cost:lte", max);
  else url.searchParams.delete("cost:lte");
  loadProduct();
}

loadProduct();
const section = document.querySelector(".container-for-catalog");
const buttons = document.createElement("div");
buttons.className = "container-for-buttons";
section.appendChild(buttons);
const find = document.createElement("input");
find.className = "find-card";
find.placeholder = "🔍";
find.addEventListener("input", function () {
  findCard(find.value);
});
buttons.appendChild(find);

const list_filter = document.createElement("select");
list_filter.className = "category-filter";
const sort = document.createElement("option");
sort.textContent = "Sort by";
sort.className = "list-sorts";
buttons.appendChild(list_filter);

const button_sort = document.createElement("option");
button_sort.value = "Cost";
button_sort.textContent = "Cost";
const button_resort = document.createElement("option");
button_resort.value = "Name";
button_resort.textContent = "Name";
const button_category = document.createElement("option");
button_category.value = "Rating";
button_category.textContent = "Rating";
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
inputMin.placeholder = "Min P";
inputMin.className = "find-card";
inputMin.style.maxWidth = "180px";
const inputMax = document.createElement("input");
inputMax.type = "number";
inputMax.placeholder = "Max P";
inputMax.className = "find-card";
inputMax.style.maxWidth = "180px";
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
hair.addEventListener("click", () => {
  sortCategory("Hair treatment");
});
containernav.appendChild(hair);

const care = document.createElement("li");
care.classList.add("button-for-nav-second", "item-for-nav-mets-last3");
care.textContent = "Professional care";
care.addEventListener("click", () => {
  sortCategory("Professional care");
});
containernav.appendChild(care);

const tools = document.createElement("li");
tools.classList.add("button-for-nav-second", "item-for-nav-mets-last3");
tools.textContent = "Styling tools";
tools.addEventListener("click", () => {
  sortCategory("Styling tools");
});
containernav.appendChild(tools);

const daily = document.createElement("li");
daily.classList.add("button-for-nav-second", "item-for-nav-mets-last3");
daily.textContent = "Daily care";
daily.addEventListener("click", () => {
  sortCategory("Daily care");
});
containernav.appendChild(daily);

// const ecare = document.createElement("li");
// ecare.classList.add("button-for-nav-second", "item-for-nav-mets-last3");
// ecare.textContent = "Everyday care";
// ecare.addEventListener("click", () => {
//   sortCategory("Everyday care");
// });
// containernav.appendChild(ecare);
const container = document.createElement("div");
container.className = "container-for-catalog-cards";
section.appendChild(container);
loadProduct();
const container_buttonPag = document.createElement("div");
container_buttonPag.className = "container-buttons";
section.appendChild(container_buttonPag);
const btnPrev = document.createElement("button");
btnPrev.textContent = "Back";
btnPrev.className = "my-custom-button";
btnPrev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    url.searchParams.set("_page", currentPage);
    loadProduct();
  } else {
    btnPrev.disabled;
  }
});
const btnNext = document.createElement("button");
btnNext.textContent = "Next";
btnNext.className = "my-custom-button";
btnNext.addEventListener("click", () => {
  if (currentPage < 3) {
    currentPage++;
    url.searchParams.set("_page", currentPage);
    loadProduct();
  } else {
    btnNext.disabled;
  }
});
container_buttonPag.appendChild(btnPrev);
container_buttonPag.appendChild(btnNext);
