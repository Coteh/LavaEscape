import 'phaser';
import { MainScene } from './scenes/MainScene';
import { HUDScene } from './scenes/HUDScene';
import { TitleScene } from './scenes/TitleScene';
import { DebugScene } from './scenes/DebugScene';

class LavaEscapeGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

var scenes: Function[] = [TitleScene, MainScene, HUDScene];

if (process.env.IS_DEBUG) {
    scenes.push(DebugScene);
}

window.onload = () => {
    const config: Phaser.Types.Core.GameConfig = {
        title: 'Lava Escape',
        width: 800,
        height: 600,
        scene: scenes,
        type: Phaser.AUTO,
        parent: 'content',
    };
    var game = new LavaEscapeGame(config);
};
