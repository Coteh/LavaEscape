import { Player } from "../gameobjects/Player";
import { Block } from "../gameobjects/Block";
import { Lava } from "../gameobjects/Lava";
import { DebugManager } from "../managers/DebugManager";
import { RegularBlockComponent } from "../gameobjects/blocks/RegularBlockComponent";
import { CollideFuncs } from "../util/CollideFuncs";
import { AbstractChunkFactory, ChunkResult } from "../factory/chunks/AbstractChunkFactory";
import { Enemy } from "../gameobjects/Enemy";
import { EnemyManager } from "../managers/EnemyManager";
import { Pickup } from "../gameobjects/Pickup";
import { BlockChunk, destroyChunk } from "../types/BlockChunk";

const SPEED_UP_TIME: number = 10000;
const ENEMY_COOLDOWN_MAX: number = 1000;
const MIN_ENEMY_MODULUS: number = 2;

export class MainScene extends Phaser.Scene {
    private player: Player;
    private lava: Lava;
    private chunkStartPos: number;
    // chunks go way beyond their height
    // TODO define chunk height at factory level
    // TODO ensure no blocks/pickups go beyond the chunk height
    private chunkHeight: number = 1200;
    private blockChunks: BlockChunk[];
    private enemies: Enemy[];
    private lavaSpeedupFactor: number = 1000;
    private lavaSpeedDivisor: number = 4;
    private elapsedTime: number = 0;
    private speedUpTime: number = SPEED_UP_TIME;
    private left: number;
    private right: number;
    private centerPos: number;

    private cKey: Phaser.Input.Keyboard.Key;

    private keys: Map<string,Phaser.Input.Keyboard.Key>;
    
    private debugManager: DebugManager;
    private chunkFactory: AbstractChunkFactory;
    private enemyManager: EnemyManager;

    private enemyModulus: number = 10;
    private enemyCooldown: number = 0;
    
    private pickups: Pickup[];
    
    constructor() {
        super({
            key: "MainScene"
        });
        this.blockChunks = [];
        this.pickups = [];
    }
    
    preload(): void {
        this.load.image("player", "./assets/img/Smiley.png");
        this.load.image("rock", "./assets/img/SpikeBall.png");
        this.load.image("lava_sink", "./assets/img/Star.png");
        this.keys = new Map([
            ["LEFT", this.input.keyboard.addKey("LEFT")],
            ["RIGHT", this.input.keyboard.addKey("RIGHT")],
            ["SPACE", this.input.keyboard.addKey("SPACE")],
        ]);
        this.cKey = this.input.keyboard.addKey("C");
        // TODO add loading screen
        // this.load.audio("music", ["./assets/audio/red_mountain.mp3"]);
    }
    
    create(): void {
        this.scene.launch("HUDScene");
        this.debugManager = new DebugManager(this);
        this.player = new Player(this, 300, 500, this.keys);
        this.player.setOnJump(this.onJump.bind(this));
        this.chunkFactory = new AbstractChunkFactory(this, this.player, this.onPlatformHit.bind(this), this.onPickup.bind(this));
        // block "chunk" of just the bottom block
        var blocks: Block[] = [];
        var block = new Block(this, 200, 600, 1000, 500, 0xfff000, 1, new RegularBlockComponent(this.player), 0)
        block.setPlayerReference(this.player);
        block.setPlayerCollideFunc(this.onPlatformHit.bind(this));
        this.add.existing(block);
        blocks.push(block);
        this.blockChunks.push({
            blocks,
            chunkStart: 600,
            chunkHeight: this.chunkHeight,
        });
        // make the center of this bottom block camera focus point
        this.centerPos = block.getBounds().centerX;
        this.cameras.main.centerOnX(this.centerPos);
        // create first chunk
        this.chunkStartPos = 200;
        this.left = -200;
        this.right = this.cameras.main.width + this.left;
        var chunk: ChunkResult = this.chunkFactory.createChunk(this.left, this.chunkStartPos);
        this.blockChunks.push({
            blocks: chunk.blocks,
            chunkStart: this.chunkStartPos,
            chunkHeight: this.chunkHeight
        });
        chunk.pickups.forEach((pickup) => {
            this.pickups.push(pickup);
        });
        this.lava = new Lava(this, 1500, this.player, this.debugManager);
        this.lava.depth = 500;
        this.add.existing(this.lava);
        this.debugManager.addKey("xspeed");
        this.debugManager.addKey("yspeed");
        this.debugManager.addKey("playerlava");
        this.debugManager.addKey("lavaSpeed");
        this.debugManager.addKey("lavaForgiveness");
        this.debugManager.addKey("lavaSpeedupFactor");
        this.debugManager.addKey("lavaSpeedDivisor");
        this.debugManager.addKey("grounded");
        this.debugManager.addKey("playerX");
        this.debugManager.addKey("playerY");
        this.debugManager.addKey("mana");
        this.player.setDebugManager(this.debugManager);
        // this.sound.play("music");
        this.enemies = [];
        this.enemyManager = new EnemyManager(this, this.player);
    }

    onPlatformHit(player: Player, block: Block): void {
        player.setGrounded(true);
        player.y = block.y - block.getBounds().height / 2 - player.getBounds().height / 2;
        block.executeBlockHitEffect();
    }
    
    onPickup() {
        this.lava.moveDown(200);
    }

    willEnemySpawn(): boolean {
        var rand = Math.round(Math.random() * this.enemyModulus);
        return (rand % this.enemyModulus == this.enemyModulus / 2 && this.enemyCooldown == 0);
    }
    
    onJump(player: Player) {
        if (this.willEnemySpawn()) {
            var enemy = this.enemyManager.spawnEnemy();
            this.enemies.push(enemy);
            this.enemyCooldown = 0.0001;
        }
    }

    update(time: number, delta: number): void {
        this.elapsedTime += delta;

        this.debugManager.setText("grounded", this.player.isGrounded().toString());
        this.debugManager.setText("playerX", this.player.x.toString());
        this.debugManager.setText("playerY", this.player.y.toString());
        this.player.update(time, delta);
        var playerGrounded: boolean = false;
        var blockChunkIndex: number = 0;
        var highestCullChunk: number = -1;
        this.blockChunks.forEach(blockChunk => {
            blockChunk.blocks.forEach(block => {
                if (block.active) {
                    block.update(time, delta);
                    if (block.hasPlayerGrounded()) {
                        playerGrounded = true;
                    }
                }
            });
            if (this.lava.y + this.lava.getBounds().height < blockChunk.chunkStart - blockChunk.chunkHeight * 4) {
                destroyChunk(blockChunk);
                highestCullChunk = blockChunkIndex;
            }
            blockChunkIndex++;
        });
        // If the player is not currently on any block, then unground them
        if (!playerGrounded) {
            this.player.setGrounded(false);
        }
        // Cull old block chunks
        if (highestCullChunk >= 0) {
            this.blockChunks = this.blockChunks.slice(highestCullChunk + 1);
            highestCullChunk = -1;
        }

        if (this.player.y < this.chunkStartPos - this.chunkHeight) {
            this.chunkStartPos -= this.chunkHeight + (this.chunkHeight / 2);
            var chunk: ChunkResult = this.chunkFactory.createChunk(this.left, this.chunkStartPos);
            this.blockChunks.push({
                blocks: chunk.blocks,
                chunkStart: this.chunkStartPos,
                chunkHeight: this.chunkHeight
            });
            chunk.pickups.forEach((pickup) => {
                this.pickups.push(pickup);
            });
        }
        this.lava.update(time, delta);
        var playerBounds = this.player.getBounds();
        var lavaBounds = this.lava.getBounds();
        if (CollideFuncs.hitTop(playerBounds, lavaBounds)) {
            this.scene.stop("MainScene");
            this.events.emit("gameOver");
        }

        if (this.player.x - playerBounds.width / 2 < this.left) {
            this.player.x = this.left + playerBounds.width / 2;
        } else if (this.player.x + playerBounds.width / 2 > this.right) {
            this.player.x = this.right - playerBounds.width / 2;
        }
        
        this.enemies.forEach((enemy) => {
            enemy.update(time, delta);
            var playerBounds = this.player.getBounds();
            var enemyBounds = enemy.getBounds();
            if (CollideFuncs.hitBounds(playerBounds, enemyBounds)) {
                if (this.player.x > enemyBounds.centerX) {
                    this.player.applyForce(30, 0);
                } else {
                    this.player.applyForce(-30, 0);   
                }
            }
        });
        
        this.pickups.forEach((pickup) => {
            if (!pickup.active) {
                return;
            }
            pickup.update(time, delta);
            var playerBounds = this.player.getBounds();
            var pickupBounds = pickup.getBounds();
            if (CollideFuncs.hitBounds(playerBounds, pickupBounds)) {
                pickup.activatePickup();
                pickup.destroy(true);
            }
        });

        this.cameras.main.centerOnY(this.player.y);
        
        this.debugManager.setText("lavaSpeedupFactor", this.lavaSpeedupFactor.toString());
        this.debugManager.setText("lavaSpeedDivisor", this.lavaSpeedDivisor.toString());
        if (this.elapsedTime > this.speedUpTime) {
            this.lava.speedUp(this.lavaSpeedupFactor);
            this.enemyModulus = (this.enemyModulus > MIN_ENEMY_MODULUS) ? this.enemyModulus - 2 : this.enemyModulus; // TODO have a separate speedup timer for enemy spawn likelihood increase
            this.speedUpTime += SPEED_UP_TIME;
            if (this.lavaSpeedupFactor > 100) {
                this.lavaSpeedupFactor /= this.lavaSpeedDivisor;
                this.lavaSpeedDivisor *= 2.5;
            }
        }
        
        if (this.input.keyboard.checkDown(this.cKey, 1000)) {
            // TODO insert anything you want to debug here, and remove this key before finishing
            this.lava.moveDown(200);
        }

        // Add Cooldown class for enemies and lava speedup
        if (this.enemyCooldown > 0 && this.enemyCooldown < ENEMY_COOLDOWN_MAX) {
            this.enemyCooldown += delta;
        } else {
            this.enemyCooldown = 0;
        }
    }
}
