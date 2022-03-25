var times = 0;
var emit = false;
var stop_ = false;

class Example extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image('bg', 'assets/stars.jpeg');
    this.load.image('ship', 'assets/nave.png');
    this.load.image('mira', 'assets/mira.png');
    this.load.image('arma', 'assets/arma.png');
    this.load.spritesheet('plasma', 'assets/plasmaball.png', { frameWidth: 128, frameHeight: 128 });

  }

  create() {
    //  Set the camera and physics bounds to be the size of 4x4 bg images
    this.cameras.main.setBounds(0, 0, 1500 * 2, 1000 * 2);
    this.physics.world.setBounds(0, 0, 1500 * 2, 1000 * 2);

    //  Mash 4 images together to create our background
    this.add.image(0, 0, 'bg').setOrigin(0);
    this.add.image(1500, 0, 'bg').setOrigin(0).setFlipX(true);
    this.add.image(0, 1000, 'bg').setOrigin(0).setFlipY(true);
    this.add.image(1500, 1000, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.nave = this.physics.add.image(200, 100, 'ship');
    this.player = this.physics.add.image(400, 300, 'mira');
    this.arma = this.physics.add.image(400, 700, 'arma');

    this.player.setCollideWorldBounds(true);
    this.nave.setCollideWorldBounds(true);
    this.arma.setCollideWorldBounds(true);

    this.particles = this.add.particles('plasma');

    this.particles.createEmitter({
      frame: 0,
      lifespan: 1000,
      speedX: { min: -20, max: 20 },
      speedY: { start: -400, end: -600, steps: 12 },
      scale: { start: 0.3, end: 0.3 },
      blendMode: 'ADD',
      on: false
    });

    this.explosion = this.add.particles('plasma');

    this.explosion.createEmitter({
      frame: 0,
      lifespan: 500,
      speed: { min: 100, max: 200 },
      scale: { start: 0.3, end: 0.3 },
      blendMode: 'ADD',
      quantity: 5,
      on: false,
    })

    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
  }

  update() {
    this.player.setVelocity(0);

    if (!stop_) {
      let velocidade = Math.floor(Math.random() * 1000) - 500;
      let v = Math.random() * 100;
      if (v < 5) {
        this.nave.setVelocityY(velocidade);
      } else if (v > 95) {
        this.nave.setVelocityX(velocidade);
      }
    }

    if (times <= 1 && emit) {
      this.explosion.emitParticleAt(this.nave.x, this.nave.y);
    }

    if ((this.player.x - 80 <= this.nave.x && this.nave.x <= this.player.x + 80) && (this.player.y - 80 <= this.nave.y && this.nave.y <= this.player.y + 80)) {
      emit = true;
      stop_ = true;
      setTimeout(() => {
        times++;
        this.nave.destroy();
        emit = false;
      }, 2000);
    }

    if (this.cursors.space.isDown) {
      this.particles.emitParticleAt(this.player.x, this.player.y + 350);
    }

    this.arma.x = this.player.x;
    this.arma.y = this.player.y + 400;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-500);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(500);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-500);
    }
    else if (this.cursors.down.isDown) {
      this.player.setVelocityY(500);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  physics: {
    default: 'arcade',
  },
  scene: [Example]
};

const game = new Phaser.Game(config);
