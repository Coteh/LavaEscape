import { Player } from "../gameobjects/Player";
import { Enemy } from "../gameobjects/Enemy";
import { Block } from "../gameobjects/Block";
import { DebugManager } from "../managers/DebugManager";

export class MainScene extends Phaser.Scene {
    private player: Player;
    private blocks: Block[];
    private lava: Phaser.GameObjects.Rectangle;

    private keys: Map<string,Phaser.Input.Keyboard.Key>;
    
    private debugManager: DebugManager;

    private blockSpeeds: number[];

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
        ]);
    }

    randomSpeed(): number {
        return Math.random() * 5;
    }

    randomPosition(): number {
        return Math.random() * 300 + 200;
    }

    create(): void {
        this.player = new Player(this, 300, 400, this.keys);
        this.blocks = [];
        this.blockSpeeds = [];
        this.blocks.push(new Block(this, 200, 600, 500, 80, 0xff0000, 0.5));
        this.blockSpeeds.push(0);
        var starting: number = 600;
        for (let i = 0; i < 100; i++) {
            var block: Block = new Block(this, this.randomPosition(), starting - (i * 200), 100, 20, 0xff0000, 1);

            this.blocks.push(block);
            this.blockSpeeds.push(this.randomSpeed());
        }
        for (let i = 0; i < this.blocks.length; i++) {
            this.add.existing(this.blocks[i]);
        }
        this.lava = new Phaser.GameObjects.Rectangle(this, 250, 1500, 1000, 500, 0xff0000, 1);
        this.add.existing(this.lava);
        this.debugManager = new DebugManager(this);
        this.debugManager.addKey("xspeed");
        this.debugManager.addKey("yspeed");
        this.debugManager.addKey("playerlava");
        this.debugManager.addKey("lavaSpeedFactor");
        this.player.setDebugManager(this.debugManager);
    }

    update(time: number, delta: number): void {
        var cam = this.cameras.main;
        this.player.update(time, delta);
        var playerBounds = this.player.getBounds();
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i].x += this.blockSpeeds[i];
            if (this.blocks[i].x < 100) {
                this.blockSpeeds[i] = -this.blockSpeeds[i];
            } else if (this.blocks[i].x > 450) {
                this.blockSpeeds[i] = -this.blockSpeeds[i];
            }
            var blockBounds = this.blocks[i].getBounds();
            if (this.hitTop(playerBounds, blockBounds) && this.player.getSpeed() > 0) {
                this.player.setGrounded(true);
                if (!this.keys.get("SPACE").isDown) {
                    this.player.jump(this.blocks[i].getJumpFactor());
                } else if (this.player.isGrounded()) {
                    this.player.jump(this.blocks[i].getJumpFactor() * 2);
                }
            }
        }
        var lavaBounds = this.lava.getBounds();
        if (this.hitTop(playerBounds, lavaBounds)) {
            this.player.setPosition(-300, -300);
        }
        var playerLava = (this.lava.y - this.player.y);
        this.debugManager.setText("playerlava", playerLava.toString());
        var lavaSpeedFactor = Math.abs(playerLava / 1000);
        this.debugManager.setText("lavaSpeedFactor", lavaSpeedFactor.toString());
        this.lava.y -= 0.3 * lavaSpeedFactor * delta;
        this.cameras.main.centerOn(this.player.x, this.player.y);
    }

    hitTop(playerBounds: Phaser.Geom.Rectangle, otherBounds: Phaser.Geom.Rectangle): boolean {
        return playerBounds.centerY + playerBounds.height / 2 >= otherBounds.centerY - otherBounds.height / 2
            && playerBounds.centerX + playerBounds.width / 2 >= otherBounds.centerX - otherBounds.width / 2
            && playerBounds.centerX - playerBounds.width / 2 <= otherBounds.centerX + otherBounds.width / 2
            && playerBounds.centerY - playerBounds.height / 2 <= otherBounds.centerY + otherBounds.height / 2
    }
}