export class Player extends Phaser.GameObjects.Sprite {
    private keys: Map<string, Phaser.Input.Keyboard.Key>;
    private DEFAULT_SPEED: number = 0.1;
    private speed: number;
    private accel: number;
    private grounded: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, keys: Map<string, Phaser.Input.Keyboard.Key>) {
        super(scene, x, y, "player");
        this.scene.add.existing(this);
        this.keys = keys;
        this.speed = this.DEFAULT_SPEED;
        this.accel = 0.00981;
    }

    update(time: number, delta: number): void {
        this.y += this.speed * delta;
        this.speed += this.accel;
        if (this.keys.get("SPACE").isDown && this.grounded) {
            this.jump(1);
        }
        if (this.keys.get("LEFT").isDown) {
            this.x -= 1;
        }
        if (this.keys.get("RIGHT").isDown) {
            this.x += 1;
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
};
