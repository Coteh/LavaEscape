import { Player } from "../gameobjects/Player";
import { Enemy } from "../gameobjects/Enemy";
import { Bullet } from "../gameobjects/Bullet";

export class MainScene extends Phaser.Scene {
    private player: Player;
    private block: Phaser.GameObjects.Shape;
    private movingBlock: Phaser.GameObjects.Shape;
    private enemy: Enemy;
    private keys: Map<string,Phaser.Input.Keyboard.Key>;

    private movingBlockSpeed: number;

    constructor() {
        super({
            key: "MainScene"
        });
    }

    preload(): void {
        this.load.image("player", "./assets/img/Smiley.png");
        this.keys = new Map([
            ["LEFT", this.input.keyboard.addKey("LEFT")],
            ["RIGHT", this.input.keyboard.addKey("RIGHT")],
            ["SPACE", this.input.keyboard.addKey("SPACE")],
            ["A", this.input.keyboard.addKey("A")],
            ["D", this.input.keyboard.addKey("D")],
            ["W", this.input.keyboard.addKey("W")],
            ["S", this.input.keyboard.addKey("S")],
        ]);
        this.movingBlockSpeed = 2;
    }

    create(): void {
        this.player = new Player(this, 300, 400, this.keys);
        this.block = new Phaser.GameObjects.Rectangle(this, 200, 600, 500, 80, 0xff0000, 1);
        this.movingBlock = new Phaser.GameObjects.Rectangle(this, 200, 400, 100, 20, 0xff0000, 1);
        this.add.existing(this.block);
        this.add.existing(this.movingBlock);
        this.enemy = new Enemy(this, 400, 400, 100, 100);
    }

    update(time: number, delta: number): void {
        this.player.update(time, delta);
        this.movingBlock.x += this.movingBlockSpeed;
        if (this.movingBlock.x < 100) {
            this.movingBlockSpeed = -this.movingBlockSpeed;
        } else if (this.movingBlock.x > 450) {
            this.movingBlockSpeed = -this.movingBlockSpeed;
        }
        var playerBounds = this.player.getBounds();
        var blockBounds = this.block.getBounds();
        var movingBlockBounds = this.movingBlock.getBounds();
        if (this.hitTop(playerBounds, blockBounds) || this.hitTop(playerBounds, movingBlockBounds)) {
            this.player.setGrounded(true);
            if (!this.keys.get("SPACE").isDown) {
                this.player.jump(0.5);
            }
        }
        this.cameras.main.centerOn(this.player.x, this.player.y);
        let playerBullets: Array<Bullet> = this.player.getBullets();
        for (let i = 0; i < playerBullets.length; i++) {
            if (this.hitTop(playerBullets[i].getBounds(), blockBounds) || this.hitTop(playerBullets[i].getBounds(), movingBlockBounds)) {
                this.children.remove(playerBullets[i]);
            }
            if (this.enemy.hitBounds(playerBullets[i])) {
                this.children.remove(playerBullets[i]);
            }
        }
    }

    hitTop(playerBounds: Phaser.Geom.Rectangle, otherBounds: Phaser.Geom.Rectangle): boolean {
        return playerBounds.centerY + playerBounds.height / 2 >= otherBounds.centerY - otherBounds.height / 2
            && playerBounds.centerX + playerBounds.width / 2 >= otherBounds.centerX - otherBounds.width / 2
            && playerBounds.centerX - playerBounds.width / 2 <= otherBounds.centerX + otherBounds.width / 2
            && playerBounds.centerY - playerBounds.height / 2 <= otherBounds.centerY + otherBounds.height / 2
    }
}