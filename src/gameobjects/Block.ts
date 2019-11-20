export class Block extends Phaser.GameObjects.Rectangle {
    private jumpFactor: number;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, fillColor: number, jumpFactor: number) {
        super(scene, x, y, width, height, fillColor, 1);
        this.jumpFactor = jumpFactor;
    }

    public getJumpFactor(): number {
        return this.jumpFactor;
    }
}