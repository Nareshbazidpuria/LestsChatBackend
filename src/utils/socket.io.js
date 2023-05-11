import app from "../../app";
import { socketAuthentictaion } from "../middleware/socketAuthentictaion";
import Socket from "socket.io";
const http = require("http").createServer(app);
const PORT = 4001;
http.listen(PORT);

export const io = Socket(http, {
  transports: ["polling", "websocket"],
  cors: {
    cors: {
      origin: "http://localhost:4001",
    },
  },
});

export let socketIo;

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers.token;
  const authenticated = await socketAuthentictaion(token);
  if (authenticated) {
    socket.user = authenticated;
    next();
  }
});

io.on("connection", (socket) => {
  socketIo = socket;
  socket.on("message", ({ message, roomId }) => {
    socket.in(roomId).emit("receive", { message, createdAt: new Date() });
  });
});
