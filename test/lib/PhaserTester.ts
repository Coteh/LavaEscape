import 'phaser';
import { Scene, Game, GameObjects } from 'phaser';

abstract class TestScene extends Scene {
    abstract setOnSceneCreated(onSceneCreated: Function): void;
}

type SceneNewable<T extends TestScene> = {
    new (...args: any[]): T;
};

export default class PhaserTester<T extends TestScene> {
    private game: Game;
    private scene: T;
    private testText: GameObjects.Text;

    constructor(sceneNewable: SceneNewable<T>, onSceneCreated: Function) {
        const config: Phaser.Types.Core.GameConfig = {
            title: 'Lava Escape',
            width: 800,
            height: 600,
            scene: [sceneNewable],
            type: Phaser.AUTO, // TODO(#39) set to HEADLESS from env var
            parent: 'content',
            callbacks: {
                postBoot: (game) => {
                    this.game = game;
                    this.scene = game.scene.getScene('MainScene') as T;
                    this.scene.setOnSceneCreated(() => {
                        this.scene.setOnSceneCreated(null);
                        if (onSceneCreated) onSceneCreated(this.scene);
                    });
                },
            },
        };
        new Game(config);
    }

    public deinit() {
        this.game.destroy(true);
    }

    public onTestStart(testName: string) {
        this.scene.game.events.removeAllListeners('grounded');
        this.testText = this.scene.add.text(0, 30, testName, {
            color: '#fff',
        });
    }

    public onTestEnd() {
        this.testText.destroy();
    }

    public delay(ms) {
        return new Promise((resolve) => {
            this.scene.time.addEvent({
                delay: ms,
                callback: resolve,
            });
        });
    }

    public waitForGameEvent(eventName: string) {
        return new Promise((resolve) => {
            this.scene.events.addListener(eventName, () => {
                resolve();
            });
        });
    }
}
