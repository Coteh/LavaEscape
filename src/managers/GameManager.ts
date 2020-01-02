import { Scene } from "phaser";

export class GameManager {
    private scene: Scene;
    private highScore: number = 0;
    private gameOver: boolean;
    
    constructor(scene: Scene) {
        this.scene = scene;
    }

    public init() {
        this.scene.events.emit("debug", "highscore", this.highScore.toString());
        this.gameOver = false;
    }

    public updateHighScore(): void {        
        var score: number = this.scene.registry.get("score");
        if (score > this.highScore) {
            this.highScore = score;
            this.scene.events.emit("debug", "highscore", this.highScore.toString());
        }
    }

    public isGameOver(): boolean {
        return this.gameOver;
    }

    public setGameOver(state: boolean): void {
        this.gameOver = state;
    }
}