/*global io, mqtt*/
/*eslint no-undef: "error"*/
const socket = io();

document.getElementById("limpar-sala").addEventListener("click", () => {
  socket.emit("limpar-sala", 1);
});

document.getElementById("iniciar-partida").addEventListener("click", () => {
  socket.emit("iniciar-partida", 1);
});

const mqttBrokerUrl = "wss://feira-de-jogos.dev.br/mqtt";
const client = mqtt.connect(mqttBrokerUrl);
const logger = document.getElementById("mqtt-logger");

client.on("connect", () => {
  logger.innerHTML += "<p>Connected to MQTT broker</p>";

  client.subscribe("#", (err) => {
    if (!err) {
      logger.innerHTML += "<p>Subscribed to all topics</p>";
    } else {
      logger.innerHTML += `<p>Error subscribing: ${err}</p>`;
    }

    client.on("message", (topic, message) => {
      logger.innerHTML += `<p><strong>Topic:</strong> ${topic} <strong>Message:</strong> ${message.toString()}</p>`;
    });
  });
});
