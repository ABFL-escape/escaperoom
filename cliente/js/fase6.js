/*global Phaser*/
/*eslint no-undef: "error"*/
export default class fase6 extends Phaser.Scene {
  constructor() {
    super("fase6");
  }

  init() {
    this.game.cenaAtual = "fase6";
  }

  preload() {
    this.load.image("fase6-fundo", "assets/fase6-fundo.png");

    this.load.spritesheet("botao-next", "assets/botao-next.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  create() {
    if (this.game.jogadores.primeiro === this.game.socket.id) {
      this.add.image(400, 225, "fase6-fundo");

      this.game.mqttClient.publish(`${this.game.mqttTopic}projecao`, "p", {
        qos: 1,
      });

      this.botao = this.add
        .sprite(360, 370, "botao-next")
        .setInteractive()
        .on("pointerdown", () => {
          this.botao.play("botao-next");

          this.game.mqttClient.publish(`${this.game.mqttTopic}fase7`, "1", {
            qos: 1,
          });

          this.botao.on("animationcomplete", () => {
            this.scene.stop();
            this.scene.start("fase7");
          });
        });
    } else if (this.game.jogadores.segundo === this.game.socket.id) {
      this.contadorTexto = this.add.text(150, 150, "20:00", {
        fontFamily: "Gravitas One",
        fontSize: "160px",
        color: "#981609",
      });
    }
  }

  update() {
    if (this.game.jogadores.segundo === this.game.socket.id) {
      this.contadorTexto.setText(
        `${String(this.game.minutos).padStart(2, "0")}:${String(
          this.game.segundos,
        ).padStart(2, "0")}`,
      );
    }
  }
}
