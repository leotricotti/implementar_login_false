import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import * as dotenv from "dotenv";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import CartsRouter from "./routes/carts.routes.js";
import LoginRouter from "./routes/login.routes.js";
import ForgotRouter from "./routes/forgot.routes.js";
import SignUpRouter from "./routes/signup.routes.js";
import SessionRouter from "./routes/session.routes.js";
import ProductsRouter from "./routes/products.routes.js";
import Products from "./dao/dbmanager/products.manager.js";
import initializePassport from "./config/passport.config.js";
import RealTimeProducts from "./routes/realTimeProducts.routes.js";

//Inicializar servicios
dotenv.config();
const productsManager = new Products();

//Variables
const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

// Handlebars
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main.handlebars",
    extname: "hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);

// Conexión respuesta de la base de datos
const enviroment = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Base de datos conectada");
  } catch (error) {
    console.log(error);
  }
};

enviroment();

// Middlewares
initializePassport();
app.use(express.json());
app.use(passport.session());
app.use(passport.initialize());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", LoginRouter);
app.use("/signup", SignUpRouter);
app.use("/forgot", ForgotRouter);
app.use("/api/carts", CartsRouter);
app.use("/api/session", SessionRouter);
app.use("/api/products", ProductsRouter);
app.use("/api/realtimeproducts", RealTimeProducts);

// Server
const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket
const io = new Server(httpServer);
// Código para el manejo de conexiones de socket
io.on("connection", async (socket) => {
  // Mensaje de bienvenida al cliente que se conectó
  console.log("Un cliente se ha conectado");

  // Obtener datos de la base de datos
  socket.on("nextPage", async (page) => {
    try {
      const products = await productsManager.getAll();
      const orderedProducts = products.reverse();
      const paginatedProducts = orderedProducts.slice(0, page * 10);
      io.emit("products", paginatedProducts);
    } catch (error) {
      // Manejar el error
      console.log(error);
    }
  });
});
