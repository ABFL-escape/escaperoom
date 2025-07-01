/*global Phaser*/
/*eslint no-undef: "error"*/
export default class finalTriste extends Phaser.Scene {
  constructor() {
    super("final-triste");
  }

  init() {
    this.game.cenaAtual = "final-triste";
  }

  preload() {
    this.load.image("final-triste", "assets/final-triste.png");
  }

  create() {
    this.add.image(400, 225, "final-triste");
  }
}
