module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("drawing", (data) => {
      console.log(data);
      socket.broadcast.emit("drawingResponse", data);
    });
  });
};
