import { Scene } from "phaser";

export class GameManager {
    private scene: Scene;
    private highScore: number = 0;
    private gameOver: boolean;
    private tutorialsCompleted: number = 0;
    
    constructor(scene: Scene) {
        this.scene = scene;
    }

    public init() {
        this.scene.events.emit("debug", "highscore", this.highScore.toString());
        this.gameOver = false;
        this.scene.registry.set("beatHighscore", false);
    }

    public updateHighScore(): void {        
        var score: number = this.scene.registry.get("score");
        if (score > this.highScore) {
            this.highScore = score;
            this.scene.registry.set("beatHighscore", true);
            this.scene.events.emit("debug", "highscore", this.highScore.toString());
        }
    }

    public isGameOver(): boolean {
        return this.gameOver;
    }

    public getNumberOfTutorialsCompleted(): number {
        return this.tutorialsCompleted;
    }

    public setGameOver(state: boolean): void {
        this.gameOver = state;
    }

    public setNumberOfTutorialsCompleted(tutorialsCompleted: number): void {
        this.tutorialsCompleted = tutorialsCompleted;
    }
}