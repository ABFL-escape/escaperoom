/*global Phaser*/
/*eslint no-undef: "error"*/
export default class Precarregamento extends Phaser.Scene {
  constructor() {
    super("precarregamento");
  }

  init() {
    this.add.rectangle(400, 300, 468, 32).setStrokeStyle(1, 0xffffff);

    const progresso = this.add.rectangle(400 - 230, 300, 4, 28, 0xffffff);
    this.load.on("progress", (progress) => {
      progresso.width = 4 + 460 * progress;
    });
  }

  preload() {
    this.load.setPath("assets/");
    this.load.image("fundo", "abertura-fundo.png");
    this.load.image("fase1-fundo", "fase1-fundo.png");
    this.load.image("fase2-fundo", "fase2-fundo.png");
    this.load.image("fase3-fundo", "fase3-fundo.png");
    this.load.image("fase4-fundo", "fase4-fundo.png");
    this.load.image("fase5-fundo", "fase5-fundo.png");
    this.load.image("fase6-fundo", "fase6-fundo.png");
    this.load.image("sala-fundo", "sala-fundo.png");
    this.load.image("vazio", "vazio.png");

    this.load.spritesheet("botao-next", "botao-next.png", {
      frameWidth: 128,
      frameHeight: 128,
    });

    this.load.spritesheet("botao-start", "botao-start.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  create() {
    this.scene.stop();
    this.scene.start("sala");
  }
}
