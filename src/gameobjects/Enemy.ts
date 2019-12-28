export class Enemy extends Phaser.GameObjects.Sprite {
    private speed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, speed: number) {
        super(scene, x, y, "rock");
        this.scene.add.existing(this);
        this.speed = speed;
    }

    update(time: number, delta: number): void {
        this.y += this.speed * delta;
    }
};
