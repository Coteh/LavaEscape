import { Lava } from '../../src/gameobjects/Lava';
import { GameObjects } from 'phaser';
import { Player } from '../../src/gameobjects/Player';
import { createSinonStubInstance } from '../lib/SinonStubHelpers';

export class LavaScene extends Phaser.Scene {
    private lava: Lava;
    private playerMock: Player;

    constructor() {
        super({
            key: 'MainScene',
        });
    }

    preload(): void {}

    create(): void {
        this.scene.launch('DebugScene');
        this.events.emit('debugToggle');
    }

    public onTestStart(testCallback): void {
        // Destroy old objects if any
        if (this.lava) this.lava.destroy();
        if (this.playerMock) this.playerMock.destroy();
        // Setup lava
        this.playerMock = new Player(this, 0, -300, new Map());
        this.playerMock.y = -300;
        this.lava = new Lava(this, 0, 600, this.playerMock);
        if (testCallback) {
            testCallback(this.lava, this.playerMock);
        }
    }

    update(time: number, delta: number): void {
        let diff: number;
        if (this.lava) {
            const oldLavaY: number = this.lava.y;
            this.lava.update(time, delta);
            diff = this.lava.y - oldLavaY;
        }
        // Player position affects lava speed, so displace it by same distance lava is to isolate this feature
        if (this.playerMock) this.playerMock.y += diff;
    }
}
