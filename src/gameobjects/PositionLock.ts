import { Scene } from "phaser";

export type LockableObject = Phaser.GameObjects.Rectangle | Phaser.GameObjects.Sprite;

export interface LockObject {
    x: number;
    getDeltaX(): number;
}

export class PositionLock extends Phaser.GameObjects.GameObject {
    private gameObject: LockableObject;
    private lockObject: LockObject;
    private lockCenter: boolean;

    constructor(scene: Scene, gameObject: LockableObject, lockObject: LockObject, lockCenter: boolean = false) {
        super(scene, "position_lock");
        this.gameObject = gameObject;
        this.lockObject = lockObject;
        this.lockCenter = lockCenter;
    }

    update(time: number, delta: number) {
        if (this.lockCenter) {
            this.gameObject.x = this.lockObject.x;
        } else {
            this.gameObject.x += this.lockObject.getDeltaX();
        }
    }
}
