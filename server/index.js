const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
  },
});

io.on("connection", (socket) => {
  console.log("User : ", socket.id);
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} ,joined the room ${room}`);
  });
  socket.on("user_typing",(isTyping)=>{
    socket.broadcast.emit("typing_status",{userId:socket.id,isTyping})
    console.log(isTyping)
  })
    socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log(data)
  });
  socket.on("disconnect", () => {
    console.log("User disconnected!!!");
  });
});
server.listen(3001, () => {
  console.log("Server Running...");
});
