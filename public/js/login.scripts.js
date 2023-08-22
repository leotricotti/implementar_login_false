// Redireecionar a la página de registro
const moveToSignup = () => {
  window.location.href = "/signup";
};

//Capturar datos del formulario de registro y los envía al servidor
async function postLogin(username, password) {
  const response = await fetch("/api/session/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();

  return result;
}

//Función que al agregar un producto al carrito y el producto ya existe en el carrito, aumenta la cantidad del producto en 1
const createCart = async () => {
  if (localStorage.getItem("cartId")) {
    return;
  }
  const response = await fetch("/api/carts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      products: [],
    }),
  });
  const result = await response.json();
};

//Comprobar si el usuario está logueado
const checkUser = async () => {
  const response = await fetch("/api/session/check", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  try {
    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Algo salió mal! Vuelve a intentarlo",
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
      });
    } else {
      window.location.href = "/api/products?page=1";
      localStorage.setItem("currentPage", 1);
      createCart();
    }
  } catch (error) {
    console.error(error);
  }
};

const loginForm = document.getElementById("login-form");

const loginButton = document.getElementById("login-button");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  postLogin(username, password);
  checkUser();
});
