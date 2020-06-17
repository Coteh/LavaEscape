import 'phaser';
import { DebugScene } from '../src/scenes/DebugScene';
import { PlayerScene } from './scenes/PlayerScene';
import { BlockScene } from './scenes/BlockScene';
import { LavaScene } from './scenes/LavaScene';
import { BackgroundScene } from './scenes/BackgroundScene';

abstract class TestScene extends Phaser.Scene {
    public abstract onTestStart(testCallback): void;
}

class TestGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

var scenes: Function[] = [];

// @ts-ignore webpack define
switch (TEST_SCENE) {
    case 'player':
        scenes.push(PlayerScene);
        break;
    case 'block':
        scenes.push(BlockScene);
        break;
    case 'lava':
        scenes.push(LavaScene);
        break;
    case 'bg':
        scenes.push(BackgroundScene);
        break;
}

if (process.env.IS_DEBUG) {
    // TODO decouple MainScene from DebugScene
    scenes.push(DebugScene);
}

window.onload = () => {
    const config: Phaser.Types.Core.GameConfig = {
        title: 'Lava Escape - Test',
        width: 800,
        height: 600,
        scene: scenes,
        type: Phaser.AUTO,
        parent: 'content',
        callbacks: {
            postBoot: (game) => {
                let scene: TestScene = game.scene.getScene(
                    'MainScene'
                ) as TestScene;
                scene.events.on('create', () => {
                    scene.onTestStart(null);
                });
            },
        },
    };
    new TestGame(config);
};
