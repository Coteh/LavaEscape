import { Player } from "../../src/gameobjects/Player";
import { Block } from "../../src/gameobjects/Block";
import { RegularBlockComponent } from "../../src/gameobjects/blocks/RegularBlockComponent";
import { getManualBounds } from "../../src/util/Bounds";

export class PlayerScene extends Phaser.Scene {
    private player: Player;
    private block: Block;
    private onSceneCreated: Function;

    private keys: Map<string, Phaser.Input.Keyboard.Key>;

    constructor() {
        super({
            key: "MainScene",
        });
    }

    setOnSceneCreated(onSceneCreated: Function): void {
        this.onSceneCreated = onSceneCreated;
    }

    preload(): void {
        this.load.image("player", "./assets/img/Player.png");
        this.load.image("base_platform", "./assets/img/BasePlatform.png");
        this.keys = new Map([
            ["LEFT", this.input.keyboard.addKey("LEFT")],
            ["RIGHT", this.input.keyboard.addKey("RIGHT")],
            ["SPACE", this.input.keyboard.addKey("SPACE")],
        ]);
    }

    create(): void {
        this.scene.launch("DebugScene");
        this.events.emit("debugToggle");
        if (this.onSceneCreated) {
            this.onSceneCreated();
        }
        this.onTestStart(null); // call test start callback here as well in the case that test is invoked using `npm run dev-test`
    }

    onTestStart(testCallback): void {
        // Destroy old objects if any
        if (this.player)
            this.player.destroy();
        if (this.block)
            this.block.destroy();
        // Setup player
        this.player = new Player(this, 300, 500, this.keys);
        this.player.setPosition(0, 100);
        // Setup base platform
        this.block = new Block(
            this,
            200,
            600,
            1000,
            500,
            "base_platform",
            1,
            new RegularBlockComponent(this.player),
            0,
        );
        this.block.setDisplaySize(800, 500);
        this.block.setPlayerReference(this.player);
        this.block.setPlayerCollideFunc(this.onPlatformHit.bind(this));
        this.add.existing(this.block);
        // make the center of this bottom block camera focus point
        this.cameras.main.centerOnX(getManualBounds(this.block).centerX);
        if (testCallback) {
            testCallback(this.player, this.block);
        }
    }

    onPlatformHit(player: Player, block: Block): void {
        var blockBounds = getManualBounds(block);
        var playerBounds = getManualBounds(player);
        player.y = block.y - blockBounds.height / 2 - playerBounds.height / 2;
        player.setGrounded(true);
        block.executeBlockHitEffect();
    }

    update(time: number, delta: number): void {
        this.player.update(time, delta);
        var playerGrounded: boolean = false;
        if (this.block.active) {
            this.block.update(time, delta);
            if (this.block.hasPlayerGrounded()) {
                playerGrounded = true;
            }
        }
        // If the player is not currently on any block, then unground them
        if (!playerGrounded) {
            this.player.setGrounded(false);
        }
        this.events.emit("debug", "grounded", this.player.isGrounded().toString());
        this.events.emit("debug", "playerX", this.player.x.toString());
        this.events.emit("debug", "playerY", this.player.y.toString());
    }
}