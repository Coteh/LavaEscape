import { BlockComponent } from "./blocks/BlockComponent";
import { RegularBlockComponent } from "./blocks/RegularBlockComponent";

export class Block extends Phaser.GameObjects.Rectangle {
    private jumpFactor: number;
    private component: BlockComponent;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, fillColor: number, jumpFactor: number, component: BlockComponent) {
        super(scene, x, y, width, height, fillColor, 1);
        this.jumpFactor = jumpFactor;
        this.component = component;
        this.component.setBlock(this);
    }

    public getJumpFactor(): number {
        return this.jumpFactor;
    }

    public executeBlockHitEffect() {
        this.component.runEffect();
    }
}