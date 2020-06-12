export class LavaScene extends Phaser.Scene {
    private onSceneCreated: Function;

    constructor() {
        super({
            key: 'MainScene',
        });
    }

    setOnSceneCreated(onSceneCreated: Function): void {
        this.onSceneCreated = onSceneCreated;
    }

    create(): void {
        this.scene.launch('DebugScene');
        this.events.emit('debugToggle');
        if (this.onSceneCreated) {
            this.onSceneCreated();
        }
        this.onTestStart(null); // call test start callback here as well in the case that test is invoked using `npm run dev-test`
    }

    onTestStart(testCallback): void {
        if (testCallback) {
            testCallback();
        }
    }

    update(time: number, delta: number): void {}
}
