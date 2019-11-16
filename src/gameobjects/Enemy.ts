import { Rectangle } from "../types/Rectangle";

export class Enemy extends Phaser.GameObjects.Rectangle {
    private hitbox: Rectangle;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height, 0xffffff, 1);
        this.scene.add.existing(this);
        this.hitbox = {
            x: x,
            y: y,
            width: width,
            height: height
        };
    }

    update(time: number, delta: number): void {
        
    }

    hitBounds(objTrans: Phaser.GameObjects.Components.Transform): boolean {
        return objTrans.x > this.hitbox.x - this.hitbox.width / 2
            && objTrans.x < this.hitbox.x + this.hitbox.width / 2
            && objTrans.y > this.hitbox.y - this.hitbox.width / 2
            && objTrans.y < this.hitbox.y + this.hitbox.width / 2;
    }
};
