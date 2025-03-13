import app from "../..";
import { sendMessage } from "../controllers/message/controller";
import { socketAuthentictaion } from "../middleware/socketAuthentictaion";
import Socket from "socket.io";
import { sendNotification } from "./push";
import { getExpoTokens } from "../controllers/auth/service";
import { ObjectId } from "mongodb";
const http = require("http").createServer(app);
const PORT = 4001;
http.listen(PORT);

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

export const io = Socket(http, {
  transports: ["polling", "websocket"],
  cors: {
    cors: {
      origin: "*",
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
    const sent =
      roomId === "644d362526d8c8d7b063e6cb"
        ? { ...message, roomId, sentBy: socket.auth._id }
        : await sendMessage({
            ...message,
            roomId,
            sentBy: socket.auth._id,
          });
    if (sent) {
      socket.in(roomId).emit("receive", sent);
      if (roomId === "644d362526d8c8d7b063e6cb") return;
      const to = (
        await getExpoTokens({ _id: ObjectId(roomId) }, socket.auth._id)
      )?.[0]?.tokens;
      sendNotification({
        to,
        title: socket.auth.name + " sent a message",
        body: message?.message,
        sound: "default",
      })
        .then(() => "sent")
        .catch((e) => console.log(e));
    }
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

  // console.log(`Socket Connected`, socket.id);
  // socket.on("room:join", (data) => {
  //   const { email, room } = data;
  //   emailToSocketIdMap.set(email, socket.id);
  //   socketidToEmailMap.set(socket.id, email);
  //   io.to(room).emit("user:joined", { email, id: socket.id });
  //   socket.join(room);
  // console.log(room)
  //   io.to(socket.id).emit("room:join", data);
  // });

  // socket.on("user:call", ({ to, offer }) => {
  //   io.to(to).emit("incomming:call", { from: socket.id, offer });
  // });

  // socket.on("call:accepted", ({ to, ans }) => {
  //   io.to(to).emit("call:accepted", { from: socket.id, ans });
  // });

  // socket.on("peer:nego:needed", ({ to, offer }) => {
  //   console.log("peer:nego:needed", offer);
  //   io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  // });

  // socket.on("peer:nego:done", ({ to, ans }) => {
  //   console.log("peer:nego:done", ans);
  //   io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  // });
});
