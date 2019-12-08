import "phaser";
import { MainScene } from "./scenes/MainScene";
import { HUDScene } from "./scenes/HUDScene";

class BounceyGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.onload = () => {
    const config: Phaser.Types.Core.GameConfig = {
        title: "Bouncey Game",
        width: 800,
        height: 600,
        scene: [MainScene, HUDScene],
        type: Phaser.AUTO,
        parent: "content"
    }
    var game = new BounceyGame(config);
};