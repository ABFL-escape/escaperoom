/*global Phaser*/
/*eslint no-undef: "error"*/
export default class sala extends Phaser.Scene {
  constructor() {
    super("sala");
  }

  init() {
    this.game.cenaAtual = "sala";
  }

  preload() {
    this.load.image("sala-fundo", "assets/sala-fundo.png");
    this.load.image("vazio", "assets/vazio.png");
  }

  create() {
    this.add.image(400, 225, "sala-fundo");

    this.salas = [
      { x: 200, y: 200, numero: "1" },
      { x: 300, y: 200, numero: "2" },
      { x: 400, y: 200, numero: "3" },
      { x: 500, y: 200, numero: "4" },
      { x: 600, y: 200, numero: "5" },
      { x: 200, y: 300, numero: "6" },
      { x: 300, y: 300, numero: "7" },
      { x: 400, y: 300, numero: "8" },
      { x: 500, y: 300, numero: "9" },
      { x: 600, y: 300, numero: "10" },
    ];

    this.salas.forEach((sala) => {
      sala.botao = this.physics.add
        .sprite(sala.x, sala.y, "vazio")
        .setInteractive()
        .on("pointerdown", () => {
          this.game.sala = sala.numero;
          this.game.socket.emit("entrar-na-sala", this.game.sala);
        });
    });

    this.game.socket.on("jogadores", (jogadores) => {
      if (jogadores.segundo) {
        this.game.jogadores = jogadores;
        this.scene.stop();
        this.scene.start("fase1");
      }
    });
  }
}
