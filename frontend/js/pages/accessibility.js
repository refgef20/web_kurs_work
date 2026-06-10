const STORAGE_KEY = "annetkaAccessibility";

const defaultSettings = {
  enabled: false,
  font: "normal",
  scheme: "black-white",
  images: "on",
};
// Класс для текстовой заглушки, которая будет вставляться вместо скрытых картинок
const imagePlaceholderClass = "a11y-image-placeholder";
let lastFocusedElement = null;
// Переменная для экземпляра MutationObserver (следит за динамическим появлением новых картинок)
let observer = null;
// Набор уникальных изображений, ожидающих обработки (скрытия)
const queuedImages = new Set();
// Переменная для хранения идентификатора кадра анимации (requestAnimationFrame)
let queuedImagesFrame = null;

const readSettings = () => {
  try {
    const savedSettings = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { ...defaultSettings, ...savedSettings };
  } catch (error) {
    return { ...defaultSettings };
  }
};

const saveSettings = (settings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

const getImageText = (image) => {
  const alt = image.getAttribute("alt");
  return alt && alt.trim()
    ? `Изображение отключено: ${alt.trim()}`
    : "Изображение отключено";
};

const shouldSkipImage = (image) => {
  return image.closest(".accessibility-modal");
};

const hideImage = (image) => {
  if (shouldSkipImage(image)) {
    return;
  }
  // Ищем элемент заглушки, идущий сразу за картинкой
  let placeholder = image.nextElementSibling;
  if (!placeholder || !placeholder.classList.contains(imagePlaceholderClass)) {
    placeholder = document.createElement("span");
    placeholder.className = imagePlaceholderClass;
    placeholder.setAttribute("role", "img");
    image.insertAdjacentElement("afterend", placeholder);
  }

  const placeholderText = getImageText(image);
  if (placeholder.textContent !== placeholderText) {
    placeholder.textContent = placeholderText;
    placeholder.setAttribute("aria-label", placeholderText);
  }

  image.classList.add("a11y-image-hidden");
  image.setAttribute("aria-hidden", "true");
};

const showImage = (image) => {
  image.classList.remove("a11y-image-hidden");
  image.removeAttribute("aria-hidden");

  const placeholder = image.nextElementSibling;
  if (placeholder && placeholder.classList.contains(imagePlaceholderClass)) {
    placeholder.remove();
  }
};

const syncImages = (imagesAreHidden) => {
  document.querySelectorAll("img").forEach((image) => {
    if (imagesAreHidden) {
      hideImage(image);
    } else {
      showImage(image);
    }
  });
};
// Функция для очистки очереди и скрытия накопившихся картинок
const flushQueuedImages = () => {
  // Сбрасываем идентификатор кадра анимации
  queuedImagesFrame = null;
  const settings = readSettings();

  if (!settings.enabled || settings.images !== "off") {
    queuedImages.clear();
    return;
  }

  queuedImages.forEach((image) => {
    // Если картинка все еще присутствует в документе (не удалена из DOM)
    if (image.isConnected) {
      hideImage(image);
    }
  });
  queuedImages.clear();
};

const queueImage = (image) => {
  if (!(image instanceof HTMLImageElement) || shouldSkipImage(image)) {
    return;
  }

  queuedImages.add(image);

  if (!queuedImagesFrame) {
    // Это предотвращает зависание интерфейса (Layout Thrashing) при массовом добавлении картинок.
    queuedImagesFrame = window.requestAnimationFrame(flushQueuedImages);
  }
};

const updateModalControls = (settings) => {
  const modal = document.querySelector("#accessibility-modal");
  if (!modal) {
    return;
  }
  // Устанавливаем атрибут aria-pressed ("true" или "false"), сообщающий, нажата ли кнопка в данный момент
  modal.querySelectorAll("[data-a11y-font]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.a11yFont === settings.font),
    );
  });
  //для кнопок выбора цветовой схемы
  modal.querySelectorAll("[data-a11y-scheme]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.a11yScheme === settings.scheme),
    );
  });

  const imageToggle = modal.querySelector("#a11y-images-toggle");
  if (imageToggle) {
    imageToggle.checked = settings.images === "off";
  }
};

const applySettings = (settings = readSettings()) => {
  const root = document.documentElement;

  if (settings.enabled) {
    root.dataset.a11yMode = "on";
    root.dataset.a11yFont = settings.font;
    root.dataset.a11yScheme = settings.scheme;
    root.dataset.a11yImages = settings.images;
  } else {
    delete root.dataset.a11yMode;
    delete root.dataset.a11yFont;
    delete root.dataset.a11yScheme;
    delete root.dataset.a11yImages;
  }

  syncImages(settings.enabled && settings.images === "off");
  updateModalControls(settings);
  // Создаем и отправляем глобальное JS-событие "accessibilityChanged",
  // чтобы другие скрипты на сайте могли среагировать на изменение темы
  window.dispatchEvent(
    new CustomEvent("accessibilityChanged", { detail: settings }),
  );
};

const updateSettings = (changes) => {
  // Объединяем старые настройки, принудительно ставим enabled: true и подмешиваем новые изменения (changes)
  const nextSettings = { ...readSettings(), enabled: true, ...changes };
  saveSettings(nextSettings);
  applySettings(nextSettings);
};

const closeAccessibilityPanel = () => {
  const modal = document.querySelector("#accessibility-modal");
  if (!modal) {
    return;
  }

  modal.hidden = true;
  document.body.classList.remove("a11y-modal-open");

  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
};

const openAccessibilityPanel = () => {
  const modal = ensureAccessibilityModal();
  const settings = { ...readSettings(), enabled: true };

  saveSettings(settings);
  applySettings(settings);
  updateModalControls(settings);

  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.classList.add("a11y-modal-open");

  const closeButton = modal.querySelector(".accessibility-modal__close");
  if (closeButton) {
    closeButton.focus();
  }
};

const resetAccessibility = () => {
  saveSettings({ ...defaultSettings });
  applySettings({ ...defaultSettings });
  closeAccessibilityPanel();
};

const ensureImageObserver = () => {
  if (observer || !document.body) {
    return;
  }

  observer = new MutationObserver((mutations) => {
    const settings = readSettings();
    if (!settings.enabled || settings.images !== "off") {
      return;
    }

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLImageElement) {
          queueImage(node);
          return;
        }

        if (node instanceof HTMLElement) {
          node.querySelectorAll("img").forEach(queueImage);
        }
      });
    });
  });

  // Запускаем слежку за тегом body:
  // childList: true — следить за добавлением/удалением дочерних тегов
  // subtree: true — следить глубоко по всей вложенности дерева тегов
  observer.observe(document.body, { childList: true, subtree: true });
};

const bindAccessibilityModal = (modal) => {
  modal.querySelectorAll("[data-a11y-close]").forEach((control) => {
    control.onclick = closeAccessibilityPanel;
  });

  modal.querySelectorAll("[data-a11y-reset]").forEach((control) => {
    control.onclick = resetAccessibility;
  });

  modal.querySelectorAll("[data-a11y-font]").forEach((control) => {
    control.onclick = () => {
      updateSettings({ font: control.dataset.a11yFont });
    };
  });

  modal.querySelectorAll("[data-a11y-scheme]").forEach((control) => {
    control.onclick = () => {
      updateSettings({ scheme: control.dataset.a11yScheme });
    };
  });

  const imageToggle = modal.querySelector("#a11y-images-toggle");
  if (imageToggle) {
    imageToggle.onchange = (event) => {
      updateSettings({ images: event.target.checked ? "off" : "on" });
    };
  }

  modal.dataset.a11yBound = "true";
};

const ensureAccessibilityModal = () => {
  let modal = document.querySelector("#accessibility-modal");
  if (modal) {
    bindAccessibilityModal(modal);
    return modal;
  }

  modal = document.createElement("div");
  modal.className = "accessibility-modal";
  modal.id = "accessibility-modal";
  modal.hidden = true;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "accessibility-modal-title");
  modal.innerHTML = `
    <div class="accessibility-modal__backdrop" data-a11y-close></div>
    <section class="accessibility-modal__dialog" aria-describedby="accessibility-modal-desc">
      <div class="accessibility-modal__header">
        <div>
          <p class="accessibility-modal__eyebrow">Annetka.Hair</p>
          <h2 id="accessibility-modal-title">Версия для слабовидящих</h2>
        </div>
        <button class="accessibility-modal__close" type="button" aria-label="Закрыть" data-a11y-close>&times;</button>
      </div>

      <p class="accessibility-modal__desc" id="accessibility-modal-desc">
        Выберите комфортный размер текста, контрастную цветовую схему и режим отображения изображений.
      </p>

      <fieldset class="accessibility-modal__group">
        <legend>Размер шрифта</legend>
        <div class="accessibility-modal__options accessibility-modal__options--three">
          <button type="button" data-a11y-font="normal">Обычный</button>
          <button type="button" data-a11y-font="large">Крупный</button>
          <button type="button" data-a11y-font="xlarge">Очень крупный</button>
        </div>
      </fieldset>

      <fieldset class="accessibility-modal__group">
        <legend>Цветовая схема</legend>
        <div class="accessibility-modal__options accessibility-modal__options--schemes">
          <button type="button" data-a11y-scheme="black-white">Черный / белый</button>
          <button type="button" data-a11y-scheme="black-green">Черный / зеленый</button>
          <button type="button" data-a11y-scheme="white-black">Белый / черный</button>
          <button type="button" data-a11y-scheme="beige-brown">Бежевый / коричневый</button>
          <button type="button" data-a11y-scheme="blue-navy">Голубой / синий</button>
        </div>
      </fieldset>

      <label class="accessibility-modal__toggle">
        <input type="checkbox" id="a11y-images-toggle" />
        <span>Отключить изображения</span>
      </label>

      <div class="accessibility-modal__actions">
        <button type="button" class="accessibility-modal__reset" data-a11y-reset>Стандартная версия</button>
        <button type="button" class="accessibility-modal__done" data-a11y-close>Готово</button>
      </div>
    </section>
  `;

  document.body.append(modal);
  bindAccessibilityModal(modal);
  return modal;
};

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAccessibilityPanel();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  ensureAccessibilityModal();
  ensureImageObserver();
  applySettings();
});

if (document.readyState !== "loading") {
  ensureAccessibilityModal();
  ensureImageObserver();
  applySettings();
}

window.openAccessibilityPanel = openAccessibilityPanel;
window.letsee_toggle_panel = openAccessibilityPanel;
