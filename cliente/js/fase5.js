/*global Phaser*/
/*eslint no-undef: "error"*/
export default class fase5 extends Phaser.Scene {
  constructor() {
    super("fase5");
  }

  init() {
    this.game.cenaAtual = "fase5";
  }

  preload() {
    this.load.image("fase5-fundo", "assets/fase5-fundo.png");
    this.load.image("vazio", "assets/vazio.png");

    this.load.spritesheet("botao-next", "assets/botao-next.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  create() {
    this.add.image(400, 225, "fase5-fundo");

    this.contadorTexto = this.add.text(350, 100, "", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.senhaDigitada = "";
    this.botoes = [
      { x: 300, y: 150, numero: 1 },
      { x: 400, y: 150, numero: 2 },
      { x: 500, y: 150, numero: 3 },
      { x: 300, y: 230, numero: 4 },
      { x: 400, y: 230, numero: 5 },
      { x: 500, y: 230, numero: 6 },
      { x: 300, y: 310, numero: 7 },
      { x: 400, y: 310, numero: 8 },
      { x: 500, y: 310, numero: 9 },
    ];

    this.botoes.forEach((botao) => {
      this.physics.add
        .sprite(botao.x, botao.y, "vazio")
        .setInteractive()
        .on("pointerdown", () => {
          this.senhaDigitada += botao.numero;

          if (this.senhaDigitada.length === 3) {
            if (this.senhaDigitada === this.game.senha) {
              this.game.mqttClient.publish(`${this.game.mqttTopic}caixa`, "0", {
                qos: 1,
                retain: true,
              });

              this.game.mqttClient.publish(`${this.game.mqttTopic}fase6`, "1", {
                qos: 1,
                retain: true,
              });

              this.scene.stop();
              this.scene.start("fase6");
            } else {
              this.game.mqttClient.publish(`${this.game.mqttTopic}caixa`, "2", {
                qos: 1,
                retain: true,
              });

              alert("Senha incorreta, tente novamente.");
              this.senhaDigitada = "";
            }
          }
        });
    });
  }

  update() {
    this.contadorTexto.setText(
      `${String(this.game.minutos).padStart(2, "0")}:${String(
        this.game.segundos
      ).padStart(2, "0")}`
    );
  }
}
