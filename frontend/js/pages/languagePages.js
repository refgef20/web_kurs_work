let currentLang = localStorage.getItem("lang") || "ru";

// Глобальные вспомогательные функции для работы с мультиязычной базой данных db.json
window.getLang = () => localStorage.getItem("lang") || "ru";

window.getLocalizedValue = (obj, key) => {
  if (!obj) return "";
  const lang = window.getLang();
  const localizedKey = `${key}_${lang}`;
  if (obj[localizedKey] !== undefined && obj[localizedKey] !== null) {
    return obj[localizedKey];
  }
  return obj[key] || "";
};

function getValueByPath(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

async function translatePage(lang = currentLang) {
  currentLang = lang;
  localStorage.setItem("lang", lang); // Сохраняем выбор в браузере

  try {
    // 1. Асинхронно скачиваем JSON-файл перевода
    const response = await fetch(`../set/language/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load lang file: ${response.status}`);
    }
    const translations = await response.json();

    // 2. Находим и переводим все элементы с data-i18n
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translation = getValueByPath(translations, key);

      if (translation) {
        if (el.children.length === 0) {
          // Если внутри элемента нет тегов, безопасно меняем текст
          el.textContent = translation;
        } else {
          // Если есть теги (например, ссылка внутри лейбла соглашения),
          // переводим только непосредственный текст родителя, сохраняя ссылки
          Array.from(el.childNodes).forEach((node) => {
            if (
              node.nodeType === Node.TEXT_NODE &&
              node.textContent.trim() !== ""
            ) {
              node.textContent = translation;
            }
          });
        }
      }
    });

    // 3. Находим и переводим все плейсхолдеры (placeholder) у полей ввода
    const placeholders = document.querySelectorAll("[data-i18n-placeholder]");
    placeholders.forEach((input) => {
      const key = input.getAttribute("data-i18n-placeholder");
      const translation = getValueByPath(translations, key);
      if (translation) {
        input.placeholder = translation;
      }
    });

    // 4. Обновляем стили кнопок переключателя (RU | EN), делая активный язык жирным
    document.querySelectorAll(".lang-switch-btn").forEach((btn) => {
      if (btn.getAttribute("data-lang") === lang) {
        btn.classList.add("active-lang");
        btn.style.textDecoration = "underline";
        btn.style.fontWeight = "bold";
      } else {
        btn.classList.remove("active-lang");
        btn.style.textDecoration = "none";
        btn.style.fontWeight = "normal";
      }
    });
  } catch (error) {
    console.error("Translation process failed:", error);
  }
}

function setLanguage(lang) {
  translatePage(lang).then(() => {
    // Оповещаем другие динамические модули на странице о смене языка
    window.dispatchEvent(new Event("languageChanged"));
  });
}

window.translatePage = translatePage;
window.setLanguage = setLanguage;

document.addEventListener("DOMContentLoaded", () => {
  translatePage();
});
