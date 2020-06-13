import 'phaser';
import { Scene, Game, GameObjects } from 'phaser';

type SceneNewable<T extends Scene> = {
    new (...args: any[]): T;
};

export default class PhaserTester<T extends Scene> {
    private game: Game;
    private scene: T;
    private sceneNewable: SceneNewable<T>;
    private testText: GameObjects.Text;

    constructor(sceneNewable: SceneNewable<T>) {
        this.sceneNewable = sceneNewable;
    }

    public getScene(): T {
        return this.scene;
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
                        resolve();
                    },
                },
            };
            new Game(config);
        });
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
