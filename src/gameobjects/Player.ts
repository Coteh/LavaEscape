import { Vector } from "../types/Vector";
import { DebugManager } from "../managers/DebugManager";

export class Player extends Phaser.GameObjects.Sprite {
    private keys: Map<string, Phaser.Input.Keyboard.Key>;
    private DEFAULT_SPEED: number = 0.1;
    private speed: number;
    private xSpeed: number = 0;
    private accel: number;
    private grounded: boolean;
    private jumped: boolean;
    private score: number;

    private debugManager: DebugManager;

    constructor(scene: Phaser.Scene, x: number, y: number, keys: Map<string, Phaser.Input.Keyboard.Key>) {
        super(scene, x, y, "player");
        this.scene.add.existing(this);
        this.keys = keys;
        this.speed = this.DEFAULT_SPEED;
        this.accel = 0.00981;
        this.score = 0;
    }

    update(time: number, delta: number): void {
        this.y += this.speed * delta;
        // TODO separate score logic into main game manager, perhaps use observer pattern?
        var workingScore: number = -this.y + 500;
        if (this.speed > 0 && workingScore > this.score) {
            this.score = workingScore;
        }
        this.scene.registry.set("score", this.score);
        this.scene.events.emit("updateScore");
        this.debugManager.setText("yspeed", this.speed.toString());
        this.debugManager.setText("xspeed", this.xSpeed.toString());
        this.speed += this.accel;
        this.x += this.xSpeed;
        this.xSpeed *= 0.49;
        // if (this.keys.get("SPACE").isDown && this.grounded) {
        //     this.jump(1);
        // }
        if (this.keys.get("LEFT").isDown) {
            this.xSpeed = -5;
        }
        if (this.keys.get("RIGHT").isDown) {
            this.xSpeed = 5;
        }
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

    public isGrounded(): boolean {
        return this.grounded;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public setDebugManager(manager: DebugManager) {
        this.debugManager = manager;
    }
};
