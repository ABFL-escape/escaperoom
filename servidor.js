const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log(`Usuário ${socket.id} conectado no servidor.`);

  socket.on("entrar-na-sala", (sala) => {
    socket.join(sala);
    console.log(`Usuário ${socket.id} entrou na sala ${sala}.`);

    let jogadores = {};
    if (io.sockets.adapter.rooms.get(sala).size === 1) {
      jogadores = {
        primeiro: socket.id,
        segundo: undefined,
      };
    } else if (io.sockets.adapter.rooms.get(sala).size === 2) {
      const [primeiro] = io.sockets.adapter.rooms.get(sala);
      jogadores = {
        primeiro,
        segundo: socket.id,
      };
      console.log(`Sala ${sala} com 2 jogadores. Partida pronta para iniciar.`);
    }

    io.to(sala).emit("jogadores", jogadores);
  });

  socket.on("offer", (sala, description) => {
    socket.to(sala).emit("offer", description);
  });

  socket.on("candidate", (sala, candidate) => {
    socket.to(sala).emit("candidate", candidate);
  });

  socket.on("answer", (sala, description) => {
    socket.to(sala).emit("answer", description);
  });

  socket.on("limpar-sala", (sala) => {
    console.log(io.sockets.adapter.rooms);
    io.socketsLeave(sala);
  });

  socket.on("iniciar-partida", (sala) => {
    socket.to(sala).emit("iniciar-partida", sala);
  });

  socket.on("disconnect", () => {});
});

app.use(express.static("./cliente/"));
server.listen(PORT, () =>
  console.log(`Servidor em execução na porta ${PORT}!`),
);
