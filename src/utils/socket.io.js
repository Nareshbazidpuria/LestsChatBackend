import app from "../..";
import { sendMessage } from "../controllers/message/controller";
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
    socket.auth = authenticated;
    next();
  }
});

io.on("connection", (socket) => {
  socketIo = socket;
  socket.join(socket.auth._id.toString());
  socket.on("message", async ({ message, roomId }) => {
    const sent = await sendMessage({
      message,
      roomId,
      sentBy: socket.auth._id,
    });
    if (sent) socket.in(roomId).emit("receive", sent);
  });

  // socket.emit("me", socket.id);
  // socket.on("callEnded", () => {
  //   socket.broadcast.emit("callEnded");
  // });
  // socket.on("callUser", (data) => {
  //   io.to(data.userToCall).emit("callUser", {
  //     signal: data.signalData,
  //     from: data.from,
  //     name: data.name,
  //   });
  // });
  // socket.on("answerCall", (data) => {
  //   io.to(data.to).emit("callAccepted", data.signal);
  // });

  socket.on("join", (roomId) => socket.join(roomId));
  socket.on("leave", (roomId) => socket.leave(roomId));
});
