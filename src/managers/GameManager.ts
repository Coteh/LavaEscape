import { Scene } from "phaser";
import { DebugManager } from "./DebugManager";

// TODO must survive between games
export class GameManager {
    private scene: Scene;
    private highScore: number = 0;
    private debugManager: DebugManager;
    
    constructor(scene: Scene) {
        this.scene = scene;
    }

    // TODO debug manager should be a scene
    public setDebugManager(debugManager: DebugManager) {
        this.debugManager = debugManager;
    }

    public init() {
        this.debugManager.setText("highscore", this.highScore.toString());
    }

    public updateHighScore(): void {        
        var score: number = this.scene.registry.get("score");
        if (score > this.highScore) {
            this.highScore = score;
            this.debugManager.setText("highscore", this.highScore.toString());
        }
    }
}