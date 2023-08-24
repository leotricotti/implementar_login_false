//Mostrar contraseña
const password = document.getElementById("password");
const newPassword = document.getElementById("new-password");
const eyeOpen = document.getElementById("eye-open");
const eyeClose = document.getElementById("eye-close");
const newEyeOpen = document.getElementById("new-eye-open");
const newEyeClose = document.getElementById("new-eye-close");

const showPassword = () => {
  if (eyeOpen.classList.contains("show-password")) {
    password.type = "text";
  } else if (newEyeOpen.classList.contains("show-password")) {
    newPassword.type = "text";
  } else {
    password.type = "password";
    newPassword.type = "password";
  }
};

eyeOpen.addEventListener("click", () => {
  eyeOpen.classList.toggle("show-password");
  eyeClose.classList.toggle("show-password");
  showPassword();
});

newEyeOpen.addEventListener("click", () => {
  newEyeOpen.classList.toggle("show-password");
  newEyeClose.classList.toggle("show-password");
  showPassword();
});
