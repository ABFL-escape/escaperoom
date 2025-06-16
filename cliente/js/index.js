/*global Phaser, io, mqtt*/
/*eslint no-undef: "error"*/
import config from "./config.js";
import abertura from "./abertura.js";
import precarregamento from "./precarregamento.js";
import sala from "./sala.js";
import fase1 from "./fase1.js";
import fase2 from "./fase2.js";
import fase3 from "./fase3.js";
import fase4 from "./fase4.js";
import fase5 from "./fase5.js";
import fase6 from "./fase6.js";
import finalFeliz from "./final-feliz.js";
import finalTriste from "./final-triste.js";

class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.audio = document.querySelector("audio");

    this.iceServers = {
      iceServers: [
        {
          urls: "stun:feira-de-jogos.dev.br",
        },
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };

    this.socket = io();

    this.socket.on("connect", () => {
      console.log(`Usuário ${this.socket.id} conectado no servidor`);
    });

    this.mqttClient = mqtt.connect("wss://feira-de-jogos.dev.br/mqtt/", {
      clientId:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      clean: false,
      keepalive: 60,
    });
    this.mqttTopic = "adc20251/escape-room/";

    this.mqttClient.on("connect", () => {
      console.log("Conectado ao broker MQTT");

      this.mqttClient.subscribe(
        `${this.mqttTopic}#`,
        {
          qos: 1,
        },
        () => {
          console.log("Inscrito no tópico adc20251/escape-room/#");
        },
      );
    });

    this.scene.add("abertura", abertura);
    this.scene.add("precarregamento", precarregamento);
    this.scene.add("sala", sala);
    this.scene.add("fase1", fase1);
    this.scene.add("fase2", fase2);
    this.scene.add("fase3", fase3);
    this.scene.add("fase4", fase4);
    this.scene.add("fase5", fase5);
    this.scene.add("fase6", fase6);
    this.scene.add("final-feliz", finalFeliz);
    this.scene.add("final-triste", finalTriste);

    this.mqttClient.on("message", (topic, message) => {
      console.log(topic, message.toString());

      if (topic === `${this.mqttTopic}fase1`) {
        this.scene.stop(this.cenaAtual);
        this.scene.start("fase1");
      } else if (topic === `${this.mqttTopic}senha`) {
        this.senha = message.toString();
      } else if (topic === `${this.mqttTopic}fase2`) {
        this.scene.stop(this.cenaAtual);
        this.scene.start("fase2");
      } else if (topic === `${this.mqttTopic}fase3`) {
        this.scene.stop(this.cenaAtual);
        this.scene.start("fase3");
      } else if (topic === `${this.mqttTopic}fase4`) {
        this.scene.stop(this.cenaAtual);
        this.scene.start("fase4");
      } else if (topic === `${this.mqttTopic}fase5`) {
        this.scene.stop(this.cenaAtual);
        this.scene.start("fase5");
      } else if (topic === `${this.mqttTopic}fase6`) {
        this.scene.stop(this.cenaAtual);
        this.scene.start("fase6");
      } else if (topic === `${this.mqttTopic}final-feliz`) {
        this.scene.stop(this.cenaAtual);
        this.scene.start("final-feliz");
      } else if (topic === `${this.mqttTopic}final-triste`) {
        this.scene.stop(this.cenaAtual);
        this.scene.start("final-triste");
      }
    });

    this.contador = 1200;
    this.minutos = 12;
    this.segundos = 0;

    this.relogio = setInterval(() => {
      this.contador--;
      this.minutos = Math.floor(this.contador / 60);
      this.segundos = Math.floor(this.contador % 60);

      if (this.contador <= 0) {
        clearInterval(this.relogio);
        this.scene.stop();
        this.scene.start("final-triste");
      }
    }, 1000);

    this.cenaAtual = "abertura";
    this.scene.start(this.cenaAtual);
  }
}

window.onload = () => {
  window.game = new Game();
};
