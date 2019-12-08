import { BlockComponent } from "./blocks/BlockComponent";
import { RegularBlockComponent } from "./blocks/RegularBlockComponent";
import { Player } from "./Player";
import { CollideFuncs } from "../util/CollideFuncs";
import { Rectangle } from "../types/Rectangle";

export class Block extends Phaser.GameObjects.Rectangle {
    private jumpFactor: number;
    private component: BlockComponent;
    private speed: number;
    private player: Player;
    private playerCollideFunc: Function;

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
        this.x += this.speed;
        if (this.x < 100) {
            this.x = 100;
            this.speed = -this.speed;
        } else if (this.x > 450) {
            this.x = 450;
            this.speed = -this.speed;
        }
        var playerBounds = this.player.getBounds();
        var blockBounds = this.getBounds();
        if (CollideFuncs.hitTop(playerBounds, blockBounds) && this.player.getSpeed() > 0) {
            this.playerCollideFunc(this.player, this);
        }
    }

    public getJumpFactor(): number {
        return this.jumpFactor;
    }

    public executeBlockHitEffect() {
        this.component.runEffect();
    }
}