import { Player } from "../gameobjects/Player";
import { Block } from "../gameobjects/Block";
import { Lava } from "../gameobjects/Lava";
import { DebugManager } from "../managers/DebugManager";
import { RegularBlockComponent } from "../gameobjects/blocks/RegularBlockComponent";
import { CollideFuncs } from "../util/CollideFuncs";
import { ChunkManager, ChunkResult } from "../managers/ChunkManager";
import { Enemy } from "../gameobjects/Enemy";
import { EnemyManager } from "../managers/EnemyManager";
import { Pickup } from "../gameobjects/Pickup";

const SPEED_UP_TIME: number = 10000;
const ENEMY_COOLDOWN_MAX: number = 1000;

export class MainScene extends Phaser.Scene {
    private player: Player;
    private lava: Lava;
    private chunkStartPos: number;
    private chunkHeight: number = 1200;
    private blockChunks: Block[][];
    private enemies: Enemy[];
    private lavaSpeedupFactor: number = 1000;
    private lavaSpeedDivisor: number = 4;
    private speedUpTime: number = SPEED_UP_TIME;

    private cKey: Phaser.Input.Keyboard.Key;

    private keys: Map<string,Phaser.Input.Keyboard.Key>;
    
    private debugManager: DebugManager;
    private chunkManager: ChunkManager;
    private enemyManager: EnemyManager;

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
            ["DOWN", this.input.keyboard.addKey("DOWN")],
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
        this.chunkManager = new ChunkManager(this, this.player, this.onPlatformHit.bind(this), this.onPickup.bind(this));
        // block "chunk" of just the bottom block
        var blocks: Block[] = [];
        var block = new Block(this, 200, 600, 500, 80, 0xff0000, 1, new RegularBlockComponent(this.player), 0)
        block.setPlayerReference(this.player);
        block.setPlayerCollideFunc(this.onPlatformHit.bind(this));
        this.add.existing(block);
        blocks.push(block);
        this.blockChunks.push(blocks);
        this.chunkStartPos = 400;
        var chunk: ChunkResult = this.chunkManager.createChunk(this.chunkStartPos);
        this.blockChunks.push(chunk.blocks);
        chunk.pickups.forEach((pickup) => {
            this.pickups.push(pickup);
        });
        this.lava = new Lava(this, 1500, this.player, this.debugManager);
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
    
    onJump(player: Player) {
        var rand = Math.round(Math.random());
        if (rand % 2 == 0 && this.enemyCooldown == 0) {
            var enemy = this.enemyManager.spawnEnemy();
            this.enemies.push(enemy);
            this.enemyCooldown = 0.0001;
        }
    }

    update(time: number, delta: number): void {
        this.debugManager.setText("grounded", this.player.isGrounded().toString());
        this.debugManager.setText("playerX", this.player.x.toString());
        this.debugManager.setText("playerY", this.player.y.toString());
        var cam = this.cameras.main;
        this.player.update(time, delta);
        var playerGrounded: boolean = false;
        this.blockChunks.forEach(blockChunk => {
            blockChunk.forEach(block => {
                if (block.active) {
                    block.update(time, delta);
                    if (block.hasPlayerGrounded()) {
                        playerGrounded = true;
                    }
                }
            });
        });
        // If the player is not currently on any block, then unground them
        if (!playerGrounded) {
            this.player.setGrounded(false);
        }
        if (this.player.y < this.chunkStartPos - this.chunkHeight) {
            this.chunkStartPos -= this.chunkHeight + (this.chunkHeight / 2);
            var chunk: ChunkResult = this.chunkManager.createChunk(this.chunkStartPos);
            this.blockChunks.push(chunk.blocks);
            chunk.pickups.forEach((pickup) => {
                this.pickups.push(pickup);
            });
        }
        this.lava.update(time, delta);
        var playerBounds = this.player.getBounds();
        var lavaBounds = this.lava.getBounds();
        if (CollideFuncs.hitTop(playerBounds, lavaBounds)) {
            this.scene.stop("MainScene");
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
                console.log("Picked up!")
            }
        });

        this.debugManager.setText("lavaSpeedupFactor", this.lavaSpeedupFactor.toString());
        this.debugManager.setText("lavaSpeedDivisor", this.lavaSpeedDivisor.toString());
        if (time > this.speedUpTime) {
            this.lava.speedUp(this.lavaSpeedupFactor);
            console.log("Speed up!");
            this.speedUpTime += SPEED_UP_TIME;
            if (this.lavaSpeedupFactor > 100) {
                this.lavaSpeedupFactor /= this.lavaSpeedDivisor;
                this.lavaSpeedDivisor *= 2.5;
            }
        }

        this.cameras.main.centerOn(this.player.x, this.player.y);

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
