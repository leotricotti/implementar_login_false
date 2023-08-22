import { Router } from "express";
import User from "../dao/dbmanager/users.manager.js";
import Product from "../dao/dbmanager/products.manager.js";

//Inicializar servicios
const router = Router();
const usersManager = new User();
const productsManager = new Product();

// Método asyncrono para obtener todos los productos
router.get("/", async (req, res) => {
  const { limit, page, sort, category } = req.query;
  try {
    const user = await usersManager.getOne(req.session.user);
    const admin = req.session.admin;
    const response = await productsManager.getAll();
    if (limit) {
      let tempArray = response.slice(0, limit);
      res.render("products", {
        products: tempArray,
        styles: "products.styles.css",
        user: user[0].first_name,
        admin: admin || false,
      });
    } else if (category) {
      let filteredProducts = await productsManager.filteredProducts(category);
      res.render("products", {
        products: filteredProducts.docs,
        styles: "products.styles.css",
        user: user[0].first_name,
        admin: admin || false,
      });
    } else if (sort) {
      let orderedProducts = await productsManager.orderedProducts(sort);
      res.render("products", {
        products: orderedProducts,
        styles: "products.styles.css",
        user: user[0].first_name,
        admin: admin || false,
      });
    } else {
      let paginatedProducts = await productsManager.paginatedProducts(page);
      res.render("products", {
        products: paginatedProducts.docs,
        styles: "products.styles.css",
        user: user[0].first_name,
        admin: admin || false,
      });
    }
  } catch (err) {
    res.render({ message: "Error al obtener los productos", data: err });
  }
});

// Método asyncrono para obtener un producto
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productsManager.getOne(pid);
    if (product) {
      res.render("products", {
        products: tempArray,
        styles: "products.styles.css",
      });
    } else {
      res.status(404).json({
        message: "Producto no encontrado",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener el producto",
      data: err,
    });
  }
});

export default router;
