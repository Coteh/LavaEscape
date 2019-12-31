import { BlockComponent } from "./blocks/BlockComponent";
import { Player } from "./Player";
import { CollideFuncs } from "../util/CollideFuncs";
import { getManualBounds } from "../util/Bounds";

export class Block extends Phaser.GameObjects.Rectangle {
    private jumpFactor: number;
    private component: BlockComponent;
    private speed: number;
    private player: Player;
    private playerCollideFunc: Function;
    private playerGrounded: boolean;
    private deltaX: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, fillColor: number, jumpFactor: number, component: BlockComponent, speed: number) {
        super(scene, x, y, width, height, fillColor, 1);
        this.jumpFactor = jumpFactor;
        this.component = component;
        this.component.setBlock(this);
        this.speed = speed;
    }

    public setPlayerReference(player: Player): void {
        this.player = player;
    }

    public setPlayerCollideFunc(playerCollideFunc: Function): void {
        this.playerCollideFunc = playerCollideFunc;
    }

    public update(time: number, delta: number): void {
        var oldX: number = this.x;
        this.x += this.speed;
        // TODO do not hardcode leftmost and rightmost
        var blockBounds = getManualBounds(this);
        if (this.speed != 0) {
            if (this.x - blockBounds.width / 2 < -100) {
                this.x = -100 + blockBounds.width / 2;
                this.speed = -this.speed;
            } else if (this.x + blockBounds.width / 2 > 600) {
                this.x = 600 - blockBounds.width / 2;
                this.speed = -this.speed;
            }
        }
        var playerBounds = getManualBounds(this.player);
        blockBounds = getManualBounds(this);
        if (CollideFuncs.hitTop(playerBounds, blockBounds) && this.player.getSpeed() > 0) {
            this.playerCollideFunc(this.player, this);
            this.playerGrounded = true;
        } else {
            this.playerGrounded = false;
        }
        this.deltaX = this.x - oldX;
    }

    public getDeltaX(): number {
        return this.deltaX;
    }

    public getJumpFactor(): number {
        return this.jumpFactor;
    }

    public executeBlockHitEffect() {
        this.component.runEffect();
    }

    public hasPlayerGrounded() {
        return this.playerGrounded;
    }

    public destroyBlock() {
        this.destroy(true);
    }
}