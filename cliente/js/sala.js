/*global Phaser*/
/*eslint no-undef: "error"*/
export default class sala extends Phaser.Scene {
  constructor() {
    super("sala");
  }

  init() {
    this.game.cenaAtual = "sala";
  }

  create() {
    this.game.sala = 1;
    this.game.socket.emit("entrar-na-sala", this.game.sala);

    this.game.socket.on("jogadores", (jogadores) => {
      if (jogadores.segundo) {
        this.game.jogadores = jogadores;
        this.scene.stop();
        this.scene.start("fase1");
      } else {
        this.add.text(100, 100, "Aguardando jogador...");
      }
    });
  }
}
