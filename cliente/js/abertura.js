export default class abertura extends Phaser.Scene {

  constructor () {
    super('abertura')
  }

  init () { }

  preload () {
    this.load.image('fundo', 'assets/abertura-fundo.png')
    this.load.spritesheet('botao1', 'assets/botao1.png', {
      frameWidth: 64,
      frameHeight: 64
    })
  }

  create () {
    this.add.image(400, 225, 'fundo')

    this.anims.create({
      key: 'botao1',
      frames: this.anims.generateFrameNumbers('botao1', { start: 28, end: 31 }),
      frameRate: 10
    })

    this.botao1 = this.add.sprite(440, 360, 'botao1', 28)
      .setInteractive()
      .on('pointerdown', () => {
        this.botao1.play('botao1')

        this.botao1.on('animationcomplete', () => {
          this.scene.stop('abertura')
          this.scene.start('precarregamento')
        })
      })
  }

  update () { }
}