export default class sala extends Phaser.Scene {
  constructor() {
    super("sala");
  }

  preload() {
    this.load.image("sala", "assets/sala.png");
    this.load.image("vazio", "assets/vazio.png");
  }

  create() {
    this.salas = [
      { x: 200, y: 200, numero: "1" },
      { x: 300, y: 200, numero: "2" },
      { x: 400, y: 200, numero: "3" },
      { x: 500, y: 200, numero: "4" },
      { x: 600, y: 200, numero: "5" },
    ];

    this.salas.forEach((sala) => {
      sala.botao = this.add
        .text(sala.x, sala.y, sala.numero)
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

    //this.scene.start('fase1')
    /* this.add.image(400, 225, 'sala')

    this.botao1 = this.physics.add.image(300, 200, 'vazio')
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.stop()
        this.scene.start('fase1')
      })*/
  }

  update() {}
}
