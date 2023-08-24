//Mostrar contraseña
const password = document.getElementById("password");
const eyeOpen = document.getElementById("eye-open");
const eyeClose = document.getElementById("eye-close");

const showPassword = () => {
  if (eyeOpen.classList.contains("show-password")) {
    password.type = "text";
  } else {
    password.type = "password";
  }
};

eyeOpen.addEventListener("click", () => {
  eyeOpen.classList.toggle("show-password");
  eyeClose.classList.toggle("show-password");
  showPassword();
});
