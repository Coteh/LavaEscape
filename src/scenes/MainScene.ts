import { Player } from "../gameobjects/Player";
import { Enemy } from "../gameobjects/Enemy";
import { Block } from "../gameobjects/Block";
import { DebugManager } from "../managers/DebugManager";
import { RegularBlockComponent } from "../gameobjects/blocks/RegularBlockComponent";
import { BrokenBlockComponent } from "../gameobjects/blocks/BrokenBlockComponent";
import { CollideFuncs } from "../util/CollideFuncs";

function playerCollide(player: Player, block: Block): void {
    player.setGrounded(true);
    // if (!this.keys.get("SPACE").isDown) {
    //     this.player.jump(this.blocks[i].getJumpFactor());
    // } else if (this.player.isGrounded()) {
    //     this.player.jump(this.blocks[i].getJumpFactor() * 2);
    // }
    block.executeBlockHitEffect();
}

export class MainScene extends Phaser.Scene {
    private player: Player;
    private lava: Phaser.GameObjects.Rectangle;
    private chunkStartPos: number;
    private chunkHeight: number = 1200;
    private blockChunks: Block[][];

    private keys: Map<string,Phaser.Input.Keyboard.Key>;
    
    private debugManager: DebugManager;

    constructor() {
        super({
            key: "MainScene"
        });
        this.blockChunks = [];
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

    createChunk(starting: number) {
        var blocks: Block[] = []
        for (let i = 0; i < 10; i++) {
            var block: Block = new Block(this, this.randomPosition(), starting - (i * 200), 100, 20, 0xff0000, 1, new RegularBlockComponent(this.player), this.randomSpeed());
            block.setPlayerReference(this.player);
            block.setPlayerCollideFunc(playerCollide);
            blocks.push(block);
            if (i % 2 == 0) {
                var block: Block = new Block(this, this.randomPosition(), starting - (i * 250), 100, 20, 0x00ff00, 2, new BrokenBlockComponent(this.player), this.randomSpeed());
                block.setPlayerReference(this.player);
                block.setPlayerCollideFunc(playerCollide);
                blocks.push(block);
            }
            var block: Block = new Block(this, this.randomPosition(), starting - (i * 300), 20, 20, 0x654321, 1, new RegularBlockComponent(this.player), 0);
            block.setPlayerReference(this.player);
            block.setPlayerCollideFunc(playerCollide);
            blocks.push(block);
        }
        console.log(blocks.length)
        for (let i = 0; i < blocks.length; i++) {
            this.add.existing(blocks[i]);
        }
        this.blockChunks.push(blocks);
        console.log("Chunk created at " + starting);
    }

    create(): void {
        this.scene.launch("HUDScene");
        this.player = new Player(this, 300, 500, this.keys);
        var blocks: Block[] = [];
        var block = new Block(this, 200, 600, 500, 80, 0xff0000, 1, new RegularBlockComponent(this.player), 0)
        block.setPlayerReference(this.player);
        block.setPlayerCollideFunc(playerCollide);
        this.add.existing(block);
        blocks.push(block);
        this.blockChunks.push(blocks);
        this.chunkStartPos = 400;
        this.createChunk(this.chunkStartPos);
        this.lava = new Phaser.GameObjects.Rectangle(this, 250, 1500, 2000, 500, 0xff0000, 1);
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
        this.blockChunks.forEach(blockChunk => {
            blockChunk.forEach(block => {
                block.update(time, delta);
            });
        });
        if (this.player.y < this.chunkStartPos - this.chunkHeight) {
            this.chunkStartPos -= this.chunkHeight + (this.chunkHeight / 2);
            this.createChunk(this.chunkStartPos);
        }
        var playerBounds = this.player.getBounds();
        var lavaBounds = this.lava.getBounds();
        if (CollideFuncs.hitTop(playerBounds, lavaBounds)) {
            this.player.setPosition(-300, -300);
        }
        var playerLava = (this.lava.y - this.player.y);
        this.debugManager.setText("playerlava", playerLava.toString());
        var lavaSpeedFactor = Math.abs(playerLava / 1000);
        this.debugManager.setText("lavaSpeedFactor", lavaSpeedFactor.toString());
        this.lava.y -= 0.3 * lavaSpeedFactor * delta;
        this.cameras.main.centerOn(this.player.x, this.player.y);
    }
}
