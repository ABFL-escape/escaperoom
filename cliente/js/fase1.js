/*global Phaser, WebFont*/
/*eslint no-undef: "error"*/
export default class fase1 extends Phaser.Scene {
  constructor() {
    super("fase1");
  }

  init() {
    this.game.cenaAtual = "fase1";
    this.game.contador = 900;

    WebFont.load({
      google: {
        families: ["Gravitas One"],
      },
    });
  }

  preload() {
    this.load.image("fase1-fundo", "assets/fase1-fundo.png");

    this.load.spritesheet("botao-next", "assets/botao-next.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  create() {
    if (this.game.jogadores.primeiro === this.game.socket.id) {
      this.add.image(400, 225, "fase1-fundo");

      this.game.remoteConnection = new RTCPeerConnection(this.game.iceServers);

      this.game.remoteConnection.onicecandidate = ({ candidate }) => {
        this.game.socket.emit("candidate", this.game.sala, candidate);
      };

      this.game.remoteConnection.ontrack = ({ streams: [stream] }) => {
        this.game.audio.srcObject = stream;
      };

      if (this.game.midias) {
        this.game.midias
          .getTracks()
          .forEach((track) =>
            this.game.remoteConnection.addTrack(track, this.game.midias)
          );
      }

      this.game.socket.on("offer", (description) => {
        this.game.remoteConnection
          .setRemoteDescription(description)
          .then(() => this.game.remoteConnection.createAnswer())
          .then((answer) =>
            this.game.remoteConnection.setLocalDescription(answer)
          )
          .then(() =>
            this.game.socket.emit(
              "answer",
              this.game.sala,
              this.game.remoteConnection.localDescription
            )
          );
      });

      this.game.socket.on("candidate", (candidate) => {
        this.game.remoteConnection.addIceCandidate(candidate);
      });

      const numbers = [];
      while (numbers.length < 3) {
        const randomNum = Math.floor(Math.random() * 5) + 4;
        if (!numbers.includes(randomNum)) {
          numbers.push(randomNum);
        }
      }

      this.game.senha = numbers.join("");
      this.game.mqttClient.publish(
        `${this.game.mqttTopic}caixa`,
        this.game.senha.toString(),
        {
          qos: 1,
        }
      );

      this.game.mqttClient.publish(`${this.game.mqttTopic}caixa`, "f", {
        qos: 1,
      });

      this.anims.create({
        key: "botao-next",
        frames: this.anims.generateFrameNumbers("botao-next", {
          start: 0,
          end: 3,
        }),
        frameRate: 10,
      });

      this.botao = this.add
        .sprite(400, 360, "botao-next")
        .setInteractive()
        .on("pointerdown", () => {
          this.botao.play("botao-next");

          this.game.mqttClient.publish(`${this.game.mqttTopic}fase2`, "1", {
            qos: 1,
          });

          this.botao.on("animationcomplete", () => {
            this.scene.stop();
            this.scene.start("fase2");
          });
        });
    } else if (this.game.jogadores.segundo === this.game.socket.id) {
      this.game.localConnection = new RTCPeerConnection(this.game.iceServers);

      this.game.localConnection.onicecandidate = ({ candidate }) => {
        this.game.socket.emit("candidate", this.game.sala, candidate);
      };

      this.game.localConnection.ontrack = ({ streams: [stream] }) => {
        this.game.audio.srcObject = stream;
      };

      if (this.game.midias) {
        this.game.midias
          .getTracks()
          .forEach((track) =>
            this.game.localConnection.addTrack(track, this.game.midias)
          );
      }

      this.game.localConnection
        .createOffer()
        .then((offer) => this.game.localConnection.setLocalDescription(offer))
        .then(() =>
          this.game.socket.emit(
            "offer",
            this.game.sala,
            this.game.localConnection.localDescription
          )
        );

      this.game.socket.on("answer", (description) => {
        this.game.localConnection.setRemoteDescription(description);
      });

      this.game.socket.on("candidate", (candidate) => {
        this.game.localConnection.addIceCandidate(candidate);
      });

      this.contadorTexto = this.add.text(150, 150, "20:00", {
        fontFamily: "Gravitas One",
        fontSize: "160px",
        color: "#981609",
      });
    } else {
      window.alert("Sala cheia!");
      this.scene.stop();
      this.scene.start("sala");
    }

    try {
      this.acl = new Accelerometer({ frequency: 60 });
      this.acl.addEventListener("reading", () => {
        if (this.acl.x > 200 || this.acl.y > 200 || this.acl.z > 200)
          this.mqttClient.publish(`${this.game.mqttTopic}panico`, "PÂNICO", {
            qos: 1,
          });
      });
      this.acl.start();
    } catch (error) {
      console.error("Acelerômetro não suportado:", error);
    }
  }

  update() {
    if (this.game.jogadores.segundo === this.game.socket.id) {
      this.contadorTexto.setText(
        `${String(this.game.minutos).padStart(2, "0")}:${String(
          this.game.segundos
        ).padStart(2, "0")}`
      );
    }
  }
}
