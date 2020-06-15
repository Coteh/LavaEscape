export class BackgroundScene extends Phaser.Scene {
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

        // Setup test stuff

        // Execute test init callback
        if (testCallback) {
            testCallback();
        }
    }

    update(time: number, delta: number): void {}
}
