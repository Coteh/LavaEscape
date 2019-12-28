export class Pickup extends Phaser.GameObjects.Sprite {
    private onPickup: Function;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, sprite: string, onPickup: Function) {
        super(scene, x, y, sprite);
        this.onPickup = onPickup;
    }

    update(time: number, delta: number): void {
        
    }

    public activatePickup() {
        this.onPickup();
    }
};
