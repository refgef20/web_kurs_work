const TOP_100_PASSWORDS_2024 = [
  "123456",
  "password",
  "12345678",
  "qwerty",
  "123456789",
  "12345",
  "1234567890",
  "1234567",
  "555555",
  "111111",
  "admin",
  "welcome",
  "letmein",
  "secret",
  "password123",
];

const suffixes = ["_dev", "_skin", "_hub", "_art", "_guru", "_core"];
let nicknameAttempts = 0;

function translit(text) {
  const rules = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
    А: "A",
    Б: "B",
    В: "V",
    Г: "G",
    Д: "D",
    Е: "E",
    Ё: "Yo",
    Ж: "Zh",
    З: "Z",
    И: "I",
    Й: "Y",
    К: "K",
    Л: "L",
    М: "M",
    Н: "N",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    У: "U",
    Ф: "F",
    Х: "Kh",
    Ц: "Ts",
    Ч: "Ch",
    Ш: "Sh",
    Щ: "Sch",
    Ъ: "",
    Ы: "Y",
    Ь: "",
    Э: "E",
    Ю: "Yu",
    Я: "Ya",
  };
  return text
    .split("")
    .map((char) => rules[char] || char)
    .join("");
}

function generateSecurePassword() {
  const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowers = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const specials = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let password = "";
  password += uppers[Math.floor(Math.random() * uppers.length)];
  password += lowers[Math.floor(Math.random() * lowers.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += specials[Math.floor(Math.random() * specials.length)];

  const allChars = uppers + lowers + digits + specials;
  for (let i = 4; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const tabLogin = document.getElementById("tab-login-btn");
  const tabRegister = document.getElementById("tab-register-btn");
  const loginFormContainer = document.getElementById("login-form-container");
  const registerFormContainer = document.getElementById(
    "register-form-container",
  );

  tabLogin.addEventListener("click", () => {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    loginFormContainer.classList.remove("hidden");
    registerFormContainer.classList.add("hidden");
  });

  tabRegister.addEventListener("click", () => {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    registerFormContainer.classList.remove("hidden");
    loginFormContainer.classList.add("hidden");
  });

  const regForm = document.getElementById("register-form");
  const lastNameInput = document.getElementById("reg-lastname");
  const firstNameInput = document.getElementById("reg-firstname");
  const patronymicInput = document.getElementById("reg-patronymic");
  const phoneInput = document.getElementById("reg-phone");
  const emailInput = document.getElementById("reg-email");
  const birthdateInput = document.getElementById("reg-birthdate");
  const usernameInput = document.getElementById("reg-username");
  const generateNickBtn = document.getElementById("generate-nick-btn");
  const nickAttemptsInfo = document.getElementById("nick-attempts-info");

  const passModeRadio = document.getElementsByName("pass-mode");
  const manualPasswordFields = document.getElementById(
    "manual-password-fields",
  );
  const autoPasswordInfo = document.getElementById("auto-password-info");

  const passwordInput = document.getElementById("reg-password");
  const confirmPasswordInput = document.getElementById("reg-confirm-password");
  const agreementCheckbox = document.getElementById("reg-agreement");
  const registerSubmitBtn = document.getElementById("register-submit-btn");

  confirmPasswordInput.addEventListener("paste", (e) => {
    e.preventDefault();
    showError(confirmPasswordInput, "Вставка пароля запрещена!");
  });

  passModeRadio.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "auto") {
        manualPasswordFields.classList.add("hidden");
        autoPasswordInfo.classList.remove("hidden");
        hideError(passwordInput);
        hideError(confirmPasswordInput);
      } else {
        manualPasswordFields.classList.remove("hidden");
        autoPasswordInfo.classList.add("hidden");
      }
      validateForm();
    });
  });

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

  function validateField(input, show = true) {
    let isValid = true;
    let errorKey = "";

    if (input === lastNameInput) {
      if (!lastNameInput.value.trim()) {
        isValid = false;
        errorKey = "auth_errors.lastname_req";
      }
    } else if (input === firstNameInput) {
      if (!firstNameInput.value.trim()) {
        isValid = false;
        errorKey = "auth_errors.firstname_req";
      }
    } else if (input === phoneInput) {
      const val = phoneInput.value.trim();
      const phoneRegex = /^\+375(25|29|33|44|17)\d{7}$/;
      if (!val) {
        isValid = false;
        errorKey = "auth_errors.phone_req";
      } else if (!phoneRegex.test(val)) {
        isValid = false;
        errorKey = "auth_errors.phone_invalid";
      }
    } else if (input === emailInput) {
      const val = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val) {
        isValid = false;
        errorKey = "auth_errors.email_req";
      } else if (!emailRegex.test(val)) {
        isValid = false;
        errorKey = "auth_errors.email_invalid";
      }
    } else if (input === birthdateInput) {
      const val = birthdateInput.value;
      if (!val) {
        isValid = false;
        errorKey = "auth_errors.birthdate_req";
      } else {
        const bDate = new Date(val);
        const today = new Date();
        let age = today.getFullYear() - bDate.getFullYear();
        const m = today.getMonth() - bDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) {
          age--;
        }
        if (age < 16) {
          isValid = false;
          errorKey = "auth_errors.birthdate_invalid";
        }
      }
    } else if (input === usernameInput) {
      if (!usernameInput.value.trim()) {
        isValid = false;
        errorKey = "auth_errors.username_req";
      }
    } else if (input === passwordInput) {
      const isManual =
        document.querySelector('input[name="pass-mode"]:checked').value ===
        "manual";
      if (isManual) {
        const pass = passwordInput.value;
        const hasUpper = /[A-Z]/.test(pass);
        const hasLower = /[a-z]/.test(pass);
        const hasDigit = /\d/.test(pass);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        const isTooShortOrLong = pass.length < 8 || pass.length > 20;
        const isCommon = TOP_100_PASSWORDS_2024.includes(pass);

        if (!pass) {
          isValid = false;
          errorKey = "auth_errors.password_req";
        } else if (isTooShortOrLong) {
          isValid = false;
          errorKey = "auth_errors.password_invalid";
        } else if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
          isValid = false;
          errorKey = "auth_errors.password_format";
        } else if (isCommon) {
          isValid = false;
          errorKey = "auth_errors.password_common";
        }
      }
    } else if (input === confirmPasswordInput) {
      const isManual =
        document.querySelector('input[name="pass-mode"]:checked').value ===
        "manual";
      if (isManual) {
        const pass = passwordInput.value;
        const confirm = confirmPasswordInput.value;
        if (!confirm) {
          isValid = false;
          errorKey = "auth_errors.confirm_req";
        } else if (pass !== confirm) {
          isValid = false;
          errorKey = "auth_errors.confirm_invalid";
        }
      }
    } else if (input === agreementCheckbox) {
      if (!agreementCheckbox.checked) {
        isValid = false;
        errorKey = "auth_errors.agreement_req";
      }
    }

    if (!isValid && show) {
      showError(input, errorKey);
    } else if (isValid) {
      hideError(input);
    }

    return isValid;
  }

  const inputsToTrack = [
    lastNameInput,
    firstNameInput,
    phoneInput,
    emailInput,
    birthdateInput,
    passwordInput,
    confirmPasswordInput,
    agreementCheckbox,
    usernameInput,
  ];

  inputsToTrack.forEach((el) => {
    el.addEventListener("input", () => {
      hideError(el);
      validateForm();
    });

    const blurEvent =
      el.type === "checkbox" || el.type === "date" ? "change" : "blur";
    el.addEventListener(blurEvent, () => {
      validateField(el, true);
      validateForm();
    });
  });

  generateNickBtn.addEventListener("click", async () => {
    const fName = firstNameInput.value.trim();
    const lName = lastNameInput.value.trim();

    if (!fName || !lName) {
      showError(usernameInput, "Сначала заполните Имя и Фамилию!");
      return;
    }
    hideError(usernameInput);

    if (nicknameAttempts < 5) {
      const generated = makeNickname(fName, lName);
      const response = await fetch(
        `http://localhost:3000/users?username=${generated}`,
      );
      const data = await response.json();

      if (data.length > 0) {
        showError(
          usernameInput,
          "Сгенерированный ник уже занят, попробуйте еще раз.",
        );
      } else {
        usernameInput.value = generated;
        nicknameAttempts++;
        nickAttemptsInfo.textContent = `Попыток генерации: ${nicknameAttempts}/5`;
        if (nicknameAttempts >= 5) {
          usernameInput.removeAttribute("readonly");
          nickAttemptsInfo.textContent +=
            " (Теперь вы можете ввести никнейм вручную)";
        }
      }
    } else {
      alert(
        "Достигнут лимит автогенерации. Пожалуйста, введите никнейм вручную.",
      );
    }
    validateForm();
  });

  function makeNickname(firstName, lastName) {
    const f = translit(firstName)
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, Math.floor(Math.random() * 3) + 1);
    const l = translit(lastName)
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, Math.floor(Math.random() * 3) + 1);
    const num = Math.floor(Math.random() * 990) + 10;
    const suf = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${f}${l}${num}${Math.random() > 0.5 ? suf : ""}`;
  }

  function validateForm() {
    let isFormValid = true;
    inputsToTrack.forEach((input) => {
      if (!validateField(input, false)) {
        isFormValid = false;
      }
    });
    registerSubmitBtn.disabled = !isFormValid;
  }

  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const checkUser = await fetch(
      `http://localhost:3000/users?username=${usernameInput.value.trim()}`,
    );
    const existing = await checkUser.json();
    if (existing.length > 0) {
      showError(usernameInput, "Данный никнейм уже существует в системе!");
      return;
    }

    let finalPassword = passwordInput.value;
    const isAuto =
      document.querySelector('input[name="pass-mode"]:checked').value ===
      "auto";
    if (isAuto) {
      finalPassword = generateSecurePassword();
    }

    const newUser = {
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      patronymic: patronymicInput.value.trim() || "",
      phone: phoneInput.value.trim(),
      email: emailInput.value.trim(),
      birthDate: birthdateInput.value,
      username: usernameInput.value.trim(),
      password: finalPassword,
      role: "client",
    };

    try {
      const saveRes = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!saveRes.ok) throw new Error("Сервер не смог сохранить пользователя");

      alert(
        `Успешная регистрация!\nВаш логин: ${newUser.username}\nПароль: ${newUser.password}`,
      );
      location.reload();
    } catch (err) {
      console.error(err);
      alert("Не удалось завершить регистрацию");
    }
  });

  // Модальное окно
  const modal = document.getElementById("agreement-modal");
  const agreementLink = document.getElementById("agreement-link");
  const closeModalBtn = document.getElementById("close-modal-btn");

  agreementLink.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("hidden");
  });

  closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    agreementCheckbox.checked = true;
    validateForm();
  });

  // Авторизация
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cred = document.getElementById("login-username").value.trim();
    const pass = document.getElementById("login-password").value;

    const response = await fetch(`http://localhost:3000/users`);
    const users = await response.json();

    const matched = users.find(
      (u) => (u.username === cred || u.email === cred) && u.password === pass,
    );

    if (matched) {
      localStorage.setItem("currentUser", JSON.stringify(matched));
      alert("Авторизация прошла успешно!");
      location.href = "../main.HTML";
    } else {
      alert("Неверные учетные данные!");
    }
  });
});
