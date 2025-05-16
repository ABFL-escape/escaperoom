export default class Fase1 extends Phaser.Scene {
  constructor () {
    super('fase1')
  }
  init () { }

  preload () {
    this.load.spritesheet('botao1', 'assets/botao1.png', {
      frameWidth: 64,
      frameHeigth: 64
    })
  }

  create () {
    this.contador = 1200;
    this.contadorTexto = this.add.text(10, 10, `Iniciando...`, {
      fontSize: "32px",
      fill: "#fff",
    });
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.contador--;
        const minutos = Math.floor(this.contador / 60);
        const segundos = Math.floor((this.contador % 60));
        this.contadorTexto.setText(`Tempo restante: ${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`);
        if (this.contador <= 0) {
          //this.trilha.stop();
          this.scene.stop();
          this.scene.start("fase2");
        }
      },
      callbackScope: this,
      loop: true,
    });

    if (this.game.jogadores.primeiro === this.game.socket.id) {
      this.game.remoteConnection = new RTCPeerConnection(this.game.iceServers);
      this.game.dadosJogo = this.game.remoteConnection.createDataChannel(
        "dadosJogo",
        { negotated: true, id: 0 }
      );
  
    } else if (this.game.jogadores.segundo === this.game.socket.id) {
      this.game.localConnection = new RTCPeerConnection(this.game.iceServers);
      this.game.dadosJogo = this.game.localConnection.createDataChannel(
        "dadosJogo",
        { negotiated: true, id: 0 }
      );
    }
  }



  update () {

  }
}


