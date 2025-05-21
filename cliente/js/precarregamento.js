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
    this.load.image("sala", "sala.png");
    this.load.spritesheet("botao1", "botao1.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.scene.stop();
    this.scene.start("sala");
  }

  update() {}
}
