import app, { response } from "../../app";
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

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  let req = {
    headers: { token },
  };
  await socketAuthentictaion(req, response, next);
});

io.on("connection", (socket) => {
  console.log("connected");
  // setTimeout(() => {
  //   socket.emit("FromAPI", { name: "dduiaw" });
  // }, 5000);
  // const deviceId = socket.handshake.headers?.deviceid;
  // socket.join(deviceId);
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
  // socket.on("sss", (data) => {
  //   console.log(data);
  // });
});

// io.broadcast()
