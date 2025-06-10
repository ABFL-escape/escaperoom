/*global Phaser*/
/*eslint no-undef: "error"*/
export default class fase3 extends Phaser.Scene {
  constructor() {
    super("fase3");
  }

  init() {
    this.game.cenaAtual = "fase3";
  }

  preload() {
    this.load.image("fase3-fundo", "assets/fase3-fundo.png");

    this.load.spritesheet("botao-next", "assets/botao-next.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  create() {
    this.add.image(400, 225, "fase3-fundo");

    this.contadorTexto = this.add.text(350, 100, "", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.botao = this.add
      .sprite(360, 370, "botao-next")
      .setInteractive()
      .on("pointerdown", () => {
        this.botao.play("botao-next");

        this.game.mqttClient.publish(
          `${this.game.mqttTopic}final-feliz`,
          "start"
        );

        this.botao.on("animationcomplete", () => {
          this.scene.stop();
          this.scene.start("final-feliz");
        });
      });
  }

  update() {
    this.contadorTexto.setText(
      `${String(this.game.minutos).padStart(2, "0")}:${String(
        this.game.segundos
      ).padStart(2, "0")}`
    );
  }
}
