const http = require("http");
const server = http.createServer();
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // Update with your frontend URL
    // origin: process.env.DEVELOPMENT_FRONTEND_URL, // Update with your frontend URL
  },
});

io.on("connection", (socket) => {
  console.log(`A user connected:  ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("logging", (data) => {
    // console.log("data",data,)
    socket.to(data.room).emit("receive_logging", data);
  });

  socket.on("logout", (data) => {
    // console.log("data",data,)
    socket.to(data.room).emit("receive_logout", data);
  });

  socket.on("leave_room", (data) => {
    socket.leave(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnecting", (data) => {
    console.log("A user disconnected: " + data);
  });

  socket.on("disconnect", (a) => {
    console.log("A user disconnected: " + socket.id);
    console.log("a: " + a);
  });
});

server.listen(5000, () => {
  console.log("WebSocket server is running on port 5000");
});
