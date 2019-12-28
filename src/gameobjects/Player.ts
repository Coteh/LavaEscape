import { DebugManager } from "../managers/DebugManager";

const DEFAULT_JUMP_FACTOR = 1.0;
const MAX_HOLD_FACTOR = 2.5;
const MAX_MANA = 5.0;

export class Player extends Phaser.GameObjects.Sprite {
    private keys: Map<string, Phaser.Input.Keyboard.Key>;
    private DEFAULT_SPEED: number = 0.1;
    private speed: number;
    private xSpeed: number = 0;
    private xForce: number = 0;
    private accel: number;
    private grounded: boolean = false;
    private score: number;
    private jumpFactor: number = DEFAULT_JUMP_FACTOR;
    private held: boolean;
    private holdFactor: number = 1;
    private mana: number = MAX_MANA;

    private onJump: Function;

    private debugManager: DebugManager;

    constructor(scene: Phaser.Scene, x: number, y: number, keys: Map<string, Phaser.Input.Keyboard.Key>) {
        super(scene, x, y, "player");
        this.scene.add.existing(this);
        this.keys = keys;
        this.speed = this.DEFAULT_SPEED;
        this.accel = 0.00981;
        this.score = 0;
    }

    public setOnJump(onJump: Function) {
        this.onJump = onJump;
    }

    update(time: number, delta: number): void {
        if (!this.grounded)
            this.y += this.speed * delta;
        else
            this.speed = 0;
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
        this.x += this.xSpeed + this.xForce;
        this.xSpeed *= 0.49;
        this.xForce *= 0.70;
        if (this.keys.get("SPACE").isDown) {
            this.speed += 0.1;
            this.held = true;
            if (this.holdFactor < MAX_HOLD_FACTOR && this.mana > 0) {
                this.holdFactor += delta / 500;
            }
            if (this.mana > 0) {
                this.mana -= 0.25;
            } else {
                this.mana = 0;
            }
        } else {
            this.held = false;
            // console.log(this.holdFactor);
            this.jumpFactor = this.holdFactor;
            this.holdFactor = DEFAULT_JUMP_FACTOR;
            if (this.mana < MAX_MANA) {
                this.mana += 0.1;
            } else {
                this.mana = MAX_MANA;
            }
        }
        this.debugManager.setText("mana", this.mana.toString());
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
        if (this.held) {
            return;
        }
        console.log(this.jumpFactor);
        this.speed = -0.5 * coefficient * this.jumpFactor;
        this.grounded = false;
        if (this.onJump !== undefined) {
            this.onJump(this);
        }
    }

    /**
     * setGrounded
     */
    public setGrounded(condition: boolean) {
        this.grounded = condition;
    }

    public applyForce(xForce: number, yForce: number) {
        this.xForce = xForce;
    }

    public isGrounded(): boolean {
        return this.grounded;
    }

    public isHeld(): boolean {
        return this.held;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public setDebugManager(manager: DebugManager) {
        this.debugManager = manager;
    }
};
