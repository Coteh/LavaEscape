import { Vector } from "../types/Vector";
import { Bullet } from "./Bullet";

const MAX_BULLET_DELAY: number = 250;

export class Player extends Phaser.GameObjects.Sprite {
    private keys: Map<string, Phaser.Input.Keyboard.Key>;
    private DEFAULT_SPEED: number = 0.1;
    private speed: number;
    private xSpeed: number = 0;
    private accel: number;
    private grounded: boolean;
    private shootDir: Vector;
    private bullets: Array<Bullet>;
    private bulletDelay: number = MAX_BULLET_DELAY;

    constructor(scene: Phaser.Scene, x: number, y: number, keys: Map<string, Phaser.Input.Keyboard.Key>) {
        super(scene, x, y, "player");
        this.scene.add.existing(this);
        this.keys = keys;
        this.speed = this.DEFAULT_SPEED;
        this.accel = 0.00981;
        this.shootDir = {
            x: 0,
            y: 0
        };
        this.bullets = [];
    }

    update(time: number, delta: number): void {
        this.y += this.speed * delta;
        this.speed += this.accel;
        this.x += this.xSpeed;
        this.xSpeed *= 0.49;
        if (this.keys.get("SPACE").isDown && this.grounded) {
            this.jump(1);
        }
        if (this.keys.get("LEFT").isDown) {
            this.xSpeed = -5;
        }
        if (this.keys.get("RIGHT").isDown) {
            this.xSpeed = 5;
        }
        let left, right, up, down: Phaser.Input.Keyboard.Key;
        left = this.keys.get("A");
        right = this.keys.get("D");
        up = this.keys.get("W");
        down = this.keys.get("S");
        if (left.isDown) {
            this.shootDir.x = -1.0;
        }
        if (right.isDown) {
            this.shootDir.x = 1.0;
        }
        if (up.isDown) {
            this.shootDir.y = -1.0;
        }
        if (down.isDown) {
            this.shootDir.y = 1.0;
        }
        let allReleased: boolean = left.isUp && right.isUp && up.isUp && down.isUp;
        if ((this.shootDir.x != 0.0 || this.shootDir.y != 0.0) && this.bulletDelay > MAX_BULLET_DELAY && !allReleased) {
            let bullet = new Bullet(this.scene, this.x, this.y, this.shootDir);
            this.scene.add.existing(bullet);
            this.bullets.push(bullet);
            this.shootDir.x = 0;
            this.shootDir.y = 0;
            this.bulletDelay = 0;
        }
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update(time, delta);
        }
        this.bulletDelay += delta;
    }

    /**
     * jump
     */
    public jump(coefficient: number): void {
        this.speed = -0.5 * coefficient;
        this.grounded = false;
    }

    /**
     * setGrounded
     */
    public setGrounded(condition: boolean) {
        this.grounded = condition;
    }

    public getBullets() {
        return this.bullets;
    }
};
