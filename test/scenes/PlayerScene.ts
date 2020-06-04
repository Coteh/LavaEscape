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
            key: "PlayerScene",
        });
    }

    setOnSceneCreated(onSceneCreated: Function) {
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
        // Setup player
        this.player = new Player(this, 300, 500, this.keys);
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
        if (this.onSceneCreated)
            this.onSceneCreated(this.player, this.block);
        this.player.setPosition(0, 150);
    }

    onPlatformHit(player: Player, block: Block): void {
        player.setGrounded(true);
        var blockBounds = getManualBounds(block);
        var playerBounds = getManualBounds(player);
        player.y = block.y - blockBounds.height / 2 - playerBounds.height / 2;
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
    }
}