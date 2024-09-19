//librerias
import express from "express";
import cors from "cors";
import multer from "multer";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import http from "http";
import { connection } from "./models/db.js";
//rutas
import { router as login } from "./router/login/loginRouter.js";
import { router as user } from "./router/user/userRouter.js";
import { router as room } from "./router/sala/salaRouter.js";
import { router as message } from "./router/mensaje/messageRouter.js";
import { router as salaUser } from "./router/sala_user/sala_userRouter.js";

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use("/uploads", express.static("uploads"));

app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.get("/", () => {});

//socket
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("sendMessage", (data) => {
    const { Men_Sal_IdFK, Men_Usu_IdFK, Men_Content, Men_Date } = data;

    // Guarda el mensaje en la base de datos
    const query = `
            INSERT INTO mensaje (Men_Sal_IdFK, Men_Usu_IdFK, Men_Content, Men_Date) 
            VALUES (?, ?, ?, ?)
        `;

    connection.query(query, [Men_Sal_IdFK, Men_Usu_IdFK, Men_Content, Men_Date]);

    // Emitir el mensaje a la sala
    io.to(data.Men_Sal_IdFK).emit("receiveMessage", {
      Men_Sal_IdFK,
      Men_Usu_IdFK,
      Men_Content,
      Men_Date: new Date().toISOString(),
    });
  });

  socket.on("joinRoom", (Sal_IdFK) => {
    socket.join(Sal_IdFK);
    console.log(`Usuario se ha unido a la sala: ${Sal_IdFK}`);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});
//rutas
app.use("/auth", login);
app.use("/user", user);
app.use("/room", room);
app.use("/message", message);
app.use("/salaUser", salaUser);

server.listen(3001, () => {
  console.log(`server corriendo en el puerto 3001`);
});
