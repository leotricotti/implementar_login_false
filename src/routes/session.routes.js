import { Router } from "express";
import { hashPassword, comparePassword } from "../utils.js";
import User from "../dao/dbmanager/users.manager.js";

//Inicializa variables
const router = Router();
const usersManager = new User();

//Ruta que realiza el login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const validPassword = comparePassword(password, username);
    const user = await usersManager.login(username, validPassword);

    if (user.length === 0)
      return res.status(401).json({
        respuesta: "Usuario o contraseña incorrectos",
      });
    else {
      if (username === "adminCoder@coder.com" && password === "adminCod3r123") {
        req.session.user = username;
        req.session.admin = true;
        delete user.password;
        res.status(200).json({
          respuesta: "Bienvenido al servidor",
        });
      } else {
        req.session.user = username;
        req.session.admin = false;
        delete user.password;
        res.status(200).json({
          respuesta: "Bienvenido a la tienda",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

//Ruta que realiza el signup
router.post("/signup", async (req, res) => {
  const { first_name, last_name, age, email, password } = req.body;
  try {
    const result = await usersManager.signup({
      first_name,
      last_name,
      age,
      email,
      password: hashPassword(password),
    });

    if (result === null) {
      return res.status(401).json({
        respuesta: "Algo salió mal. No hemos podido crear el usuario",
      });
    } else {
      req.session.user = email;
      res.status(200).json({
        respuesta: "Usuario creado exitosamente",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

//Ruta que comprueba si el usuario está logueado
router.get("/check", async (req, res) => {
  try {
    const user = await req.session.user;

    if (user) {
      res.status(200).json({
        respuesta: "Bienvenido a la tienda",
      });
    } else {
      res.status(401).json({
        respuesta: "Algo salió mal. No hemos podido identificar al usuario",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

//Ruta que realiza el logout
router.get("/logout", async (req, res) => {
  try {
    const logout = req.session.destroy();
    if (logout) {
      res.redirect("/");
    } else {
      res.status(401).json({
        respuesta: "Algo salió mal. No hemos podido cerrar la sesión",
      });
    }
  } catch (error) {
    console.error(error);
  }
});

//Ruta que recupera la contraseña
router.post("/forgot", async (req, res) => {
  const { username, newPassword } = req.body;

  const result = await usersManager.getOne(username);
  if (result.length === 0)
    return res.status(401).json({
      respuesta: "El usuario no existe",
    });
  else {
    const updatePassword = await usersManager.updatePassword(
      createHash(newPassword)
    );
    console.log(respuesta);
    res.status(200).json({
      respuesta: "Contrseña actualizada con éxito",
    });
  }
});

export default router;
