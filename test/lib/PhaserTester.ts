import 'phaser';
import { Scene, Game, GameObjects } from 'phaser';

type SceneNewable<T extends Scene> = {
    new (...args: any[]): T;
};

abstract class TestScene extends Scene {
    public abstract onTestStart(testCallback): void;
}

export default class PhaserTester<T extends TestScene> {
    private game: Game;
    private scene: T;
    private sceneNewable: SceneNewable<T>;
    private testText: GameObjects.Text;

    public keyDown: EventListenerOrEventListenerObject;
    public keyUp: EventListenerOrEventListenerObject;

    constructor(sceneNewable: SceneNewable<T>) {
        this.sceneNewable = sceneNewable;
    }

    public getScene(): T {
        return this.scene;
    }

    public getGameWidth() {
        return this.game.canvas.width;
    }

    public async setup(): Promise<void> {
        return new Promise((resolve) => {
            const config: Phaser.Types.Core.GameConfig = {
                title: 'Lava Escape',
                width: 800,
                height: 600,
                type: Phaser.AUTO, // TODO(#39) set to HEADLESS from env var
                parent: 'content',
                callbacks: {
                    postBoot: (game) => {
                        this.game = game;
                        this.scene = game.scene.add(
                            'MainScene',
                            this.sceneNewable,
                            true
                        ) as T;
                        this.scene.events.on('create', () => {
                            resolve();
                        });
                    },
                },
            };
            new Game(config);
        });
    }

    public deinit() {
        this.game.destroy(true);
    }

    public startTestCase(
        testName: string,
        sceneTestStartCallback: Function
    ): void {
        window.removeEventListener('keydown', this.keyDown);
        window.removeEventListener('keyup', this.keyUp);
        this.scene.game.events.removeAllListeners('grounded');
        this.game.events.removeAllListeners('step');
        this.testText = this.scene.add.text(0, 30, testName, {
            color: '#fff',
        });
        this.testText.depth = 1000;
        this.game.events.on('step', () => {
            let mainCam = this.scene.cameras.main;
            this.testText.setPosition(mainCam.scrollX, mainCam.scrollY);
        });
        this.scene.onTestStart(sceneTestStartCallback);
    }

    public endTestCase() {
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

    public waitForCondition(condition: Function) {
        return new Promise((resolve, reject) => {
            if (!condition) {
                reject(new Error('No condition provided'));
                return;
            }
            this.game.events.on('step', () => {
                if (condition()) {
                    resolve();
                }
            });
        });
    }
}
