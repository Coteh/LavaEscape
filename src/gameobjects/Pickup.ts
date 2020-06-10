import { getManualBounds } from '../util/Bounds';
import { PositionLock, LockObject } from './PositionLock';

export class Pickup extends Phaser.GameObjects.Sprite {
    private onPickup: Function;
    private lockObject: PositionLock;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        sprite: string,
        onPickup: Function
    ) {
        super(scene, x, y, sprite);
        this.onPickup = onPickup;
    }

    public lockOn(gameObject: LockObject) {
        this.lockObject = new PositionLock(this.scene, this, gameObject, true);
    }

    update(time: number, delta: number): void {
        if (this.lockObject) {
            this.lockObject.update(time, delta);
        }
    }

    public activatePickup() {
        this.onPickup();
    }
}
