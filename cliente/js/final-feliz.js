/*global Phaser*/
/*eslint no-undef: "error"*/
export default class FinalFeliz extends Phaser.Scene {
  constructor() {
    super("final-feliz");
  }

  init() {
    this.game.cenaAtual = "final-feliz";
  }
}
