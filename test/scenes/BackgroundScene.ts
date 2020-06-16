import { ScrollingBackground } from '../../src/gameobjects/ScrollingBackground';
import { Player } from '../../src/gameobjects/Player';

export class BackgroundScene extends Phaser.Scene {
    private background: ScrollingBackground;
    private playerMock: Player;

    constructor() {
        super({
            key: 'MainScene',
        });
    }

    preload(): void {
        this.load.image('background', './assets/img/mountain.jpg');
    }

    create(): void {
        this.scene.launch('DebugScene');
        this.events.emit('debugToggle');
    }

    public onTestStart(testCallback): void {
        // Destroy old objects if any
        if (this.background) this.background.destroy();
        if (this.playerMock) this.playerMock.destroy();
        // Setup test stuff
        // Initialize scrolling background
        this.background = new ScrollingBackground(this, 'background');
        // Setup player
        this.playerMock = new Player(this, 300, 500, new Map());
        this.background.followPlayer(this.playerMock);
        // Execute test init callback
        if (testCallback) {
            testCallback(this.background, this.playerMock);
        }
    }

    update(time: number, delta: number): void {
        // this.playerMock?.update(time, delta);
        this.background?.update(time, delta);
    }
}
