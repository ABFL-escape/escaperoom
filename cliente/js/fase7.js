/*global Phaser*/
/*eslint no-undef: "error"*/
export default class fase7 extends Phaser.Scene {
  constructor() {
    super("fase7");
  }

  init() {
    this.game.cenaAtual = "fase7";
  }

  preload() {
    this.load.image("fase7-fundo", "assets/fase7-fundo.png");

    this.load.spritesheet("botao-next", "assets/botao-next.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  create() {
    if (this.game.jogadores.primeiro === this.game.socket.id) {
      this.add.image(400, 225, "fase7-fundo");

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
          this.game.segundos
        ).padStart(2, "0")}`
      );
    }
  }
}
