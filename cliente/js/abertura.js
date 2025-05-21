/*global Phaser*/
/*eslint no-undef: "error"*/
export default class abertura extends Phaser.Scene {
  constructor() {
    super("abertura");
  }

  init() {
    this.game.cenaAtual = "abertura";
  }

  preload() {
    this.load.image("abertura-fundo", "assets/abertura-fundo.png");

    this.load.spritesheet("botao-start", "assets/botao-start.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  create() {
    this.add.image(400, 225, "abertura-fundo");

    this.anims.create({
      key: "botao-start",
      frames: this.anims.generateFrameNumbers("botao-start", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
    });

    this.botao = this.add
      .sprite(440, 360, "botao-start")
      .setInteractive()
      .on("pointerdown", () => {
        this.botao.play("botao-start");

        navigator.mediaDevices
          .getUserMedia({ video: false, audio: true })
          .then((stream) => {
            this.game.midias = stream;
          })
          .catch((error) => {
            console.error("Erro ao acessar o microfone:", error);
          });

        this.botao.on("animationcomplete", () => {
          this.scene.stop();
          this.scene.start("precarregamento");
        });
      });
  }
}
