import { Vector } from "../types/Vector";

export class Bullet extends Phaser.GameObjects.Ellipse {
    private shootDir: Vector
    private shootSpeed: number = 1;

    constructor(scene: Phaser.Scene, x: number, y: number, shootDir: Vector) {
        super(scene, x, y, 6, 6, 0x00ffff, 1);
        this.shootDir = {
            x: 0,
            y: 0
        };
        this.shootDir = Object.assign(this.shootDir, shootDir);
    }

    update(time: number, delta: number): void {
        this.x += this.shootDir.x * this.shootSpeed * delta;
        this.y += this.shootDir.y * this.shootSpeed * delta;
    }
}