/*global Phaser*/
/*eslint no-undef: "error"*/
export default class finalFeliz extends Phaser.Scene {
  constructor() {
    super("final-feliz");
  }

  init() {
    this.game.cenaAtual = "final-feliz";
  }

  preload() {
    this.load.image("final-feliz", "assets/final-feliz.png");
  }

  create() {
    this.add.image(400, 225, "final-feliz");
  }
}
