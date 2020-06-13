export class LavaScene extends Phaser.Scene {
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
        if (testCallback) {
            testCallback();
        }
    }

    update(time: number, delta: number): void {}
}
