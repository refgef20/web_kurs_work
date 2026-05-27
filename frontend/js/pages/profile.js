document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    alert("Пожалуйста, сначала авторизуйтесь!");
    location.href = "auth.html";
    return;
  }

  // DOM Элементы боковой панели
  const avatarEl = document.getElementById("user-avatar");
  const displayFullName = document.getElementById("display-fullname");
  const displayUsername = document.getElementById("display-username");
  const displayRole = document.getElementById("display-role");

  // DOM Элементы ввода формы
  const inputLastName = document.getElementById("p-lastname");
  const inputFirstName = document.getElementById("p-firstname");
  const inputPatronymic = document.getElementById("p-patronymic");
  const inputPhone = document.getElementById("p-phone");
  const inputEmail = document.getElementById("p-email");
  const inputBirthDate = document.getElementById("p-birthdate");
  const inputUsername = document.getElementById("p-username");
  const inputRole = document.getElementById("p-role");

  const form = document.getElementById("profile-form");
  const submitBtn = document.querySelector(".profile-submit-btn");

  // Ограничение возраста по календарю (16 лет)
  const today = new Date();
  const maxAllowableDate = new Date(
    today.getFullYear() - 16,
    today.getMonth(),
    today.getDate(),
  );
  const maxDateString = maxAllowableDate.toISOString().split("T")[0];
  inputBirthDate.max = maxDateString;

  // Массив отслеживаемых полей для интерактивной валидации
  const inputsToTrack = [
    inputLastName,
    inputFirstName,
    inputPhone,
    inputEmail,
    inputBirthDate,
    inputUsername,
  ];

  // Динамический вывод ошибок
  function showError(input, text) {
    let errorSpan = input.parentNode.querySelector(".error-message");
    if (!errorSpan) {
      errorSpan = document.createElement("span");
      errorSpan.className = "error-message";
      input.parentNode.appendChild(errorSpan);
    }
    errorSpan.textContent = text;
    errorSpan.style.display = "block";
  }

  function hideError(input) {
    const errorSpan = input.parentNode.querySelector(".error-message");
    if (errorSpan) {
      errorSpan.style.display = "none";
    }
  }

  // Единая функция валидации конкретного поля
  function validateField(input, show = true) {
    let isValid = true;
    let errorMsg = "";

    if (input === inputLastName) {
      if (!inputLastName.value.trim()) {
        isValid = false;
        errorMsg = "Фамилия обязательна к заполнению";
      }
    } else if (input === inputFirstName) {
      if (!inputFirstName.value.trim()) {
        isValid = false;
        errorMsg = "Имя обязательно к заполнению";
      }
    } else if (input === inputPhone) {
      const val = inputPhone.value.trim();
      const phoneRegex = /^\+375(25|29|33|44|17)\d{7}$/;
      if (!val) {
        isValid = false;
        errorMsg = "Номер телефона обязателен";
      } else if (!phoneRegex.test(val)) {
        isValid = false;
        errorMsg =
          "Некорректный номер РБ. Пример: +375XXXXXXXXX (25, 29, 33, 44, 17)";
      }
    } else if (input === inputEmail) {
      const val = inputEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val) {
        isValid = false;
        errorMsg = "Email обязателен";
      } else if (!emailRegex.test(val)) {
        isValid = false;
        errorMsg = "Неверный формат email адреса";
      }
    } else if (input === inputBirthDate) {
      const val = inputBirthDate.value;
      if (!val) {
        isValid = false;
        errorMsg = "Укажите дату рождения";
      } else {
        const bDate = new Date(val);
        const curDate = new Date();
        let age = curDate.getFullYear() - bDate.getFullYear();
        const m = curDate.getMonth() - bDate.getMonth();
        if (m < 0 || (m === 0 && curDate.getDate() < bDate.getDate())) {
          age--;
        }
        if (age < 16) {
          isValid = false;
          errorMsg = "Изменение данных доступно только с 16 лет";
        }
      }
    } else if (input === inputUsername) {
      if (!inputUsername.value.trim()) {
        isValid = false;
        errorMsg = "Никнейм обязателен к заполнению";
      }
    }

    if (!isValid && show) {
      showError(input, errorMsg);
    } else if (isValid) {
      hideError(input);
    }

    return isValid;
  }

  // Общая проверка формы для переключения активности кнопки «Сохранить»
  function validateForm() {
    let isFormValid = true;
    inputsToTrack.forEach((input) => {
      if (!validateField(input, false)) {
        isFormValid = false;
      }
    });
    submitBtn.disabled = !isFormValid;
    submitBtn.style.opacity = isFormValid ? "1" : "0.5";
    submitBtn.style.cursor = isFormValid ? "pointer" : "not-allowed";
  }

  // Прикрепление слушателей событий ко всем полям ввода
  inputsToTrack.forEach((el) => {
    el.addEventListener("input", () => {
      hideError(el);
      validateForm();
    });

    const blurEvent = el.type === "date" ? "change" : "blur";
    el.addEventListener(blurEvent, () => {
      validateField(el, true);
      validateForm();
    });
  });

  // Загрузка первичных данных пользователя из db.json
  async function loadUserData() {
    try {
      const res = await fetch(`http://localhost:3000/users/${currentUser.id}`);
      if (!res.ok) {
        throw new Error(`Ошибка загрузки данных: ${res.status}`);
      }
      const user = await res.json();

      const initials = (
        (user.firstName ? user.firstName[0] : "") +
        (user.lastName ? user.lastName[0] : "")
      ).toUpperCase();

      avatarEl.textContent = initials || "U";

      displayFullName.textContent =
        `${user.lastName || ""} ${user.firstName || ""} ${user.patronymic || ""}`.trim() ||
        "Пользователь";
      displayUsername.textContent = `@${user.username}`;
      displayRole.textContent =
        user.role === "admin" ? "Администратор" : "Клиент";

      inputLastName.value = user.lastName || "";
      inputFirstName.value = user.firstName || "";
      inputPatronymic.value = user.patronymic || "";
      inputPhone.value = user.phone || "";
      inputEmail.value = user.email || "";
      inputBirthDate.value = user.birthDate || "";
      inputUsername.value = user.username || "";
      inputRole.value = user.role === "admin" ? "Администратор" : "Клиент";

      validateForm(); // Вызов первичной проверки валидности полей
    } catch (error) {
      console.error("Ошибка при получении профиля:", error);
      alert("Не удалось загрузить данные личного кабинета.");
    }
  }

  // Обработка отправки формы
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Проверка уникальности никнейма в системе
    const checkUser = await fetch(
      `http://localhost:3000/users?username=${inputUsername.value.trim()}`,
    );
    const existing = await checkUser.json();

    // Никнейм занят только в том случае, если его обладателем является ДРУГОЙ пользователь (id не равен currentUser.id)
    const isDuplicate = existing.some((u) => u.id !== currentUser.id);
    if (isDuplicate) {
      showError(
        inputUsername,
        "Данный никнейм уже занят другим пользователем!",
      );
      return;
    }

    const updatedData = {
      lastName: inputLastName.value.trim(),
      firstName: inputFirstName.value.trim(),
      patronymic: inputPatronymic.value.trim(),
      phone: inputPhone.value.trim(),
      email: inputEmail.value.trim(),
      birthDate: inputBirthDate.value,
      username: inputUsername.value.trim(),
    };

    try {
      const res = await fetch(`http://localhost:3000/users/${currentUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        throw new Error(`Ошибка при сохранении: ${res.status}`);
      }

      const updatedUser = await res.json();

      currentUser.username = updatedUser.username;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      alert("Изменения успешно сохранены!");
      loadUserData();
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
      alert("Произошла ошибка при сохранении изменений.");
    }
  });

  loadUserData();
});
