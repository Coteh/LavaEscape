import "phaser";
import { DebugScene } from "../src/scenes/DebugScene";
import { PlayerScene } from "./scenes/PlayerScene";

class TestGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

var scenes: Function[] = [];

// @ts-ignore webpack define
switch (TEST_SCENE) {
    case "player":
        scenes.push(PlayerScene);
        break;
}

if (process.env.IS_DEBUG) {
    // TODO decouple MainScene from DebugScene
    // scenes.push(DebugScene);
}

window.onload = () => {
    const config: Phaser.Types.Core.GameConfig = {
        title: "Lava Escape - Test",
        width: 800,
        height: 600,
        scene: scenes,
        type: Phaser.AUTO,
        parent: "content"
    }
    new TestGame(config);
};
