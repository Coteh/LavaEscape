export class HUDScene extends Phaser.Scene {
    private scoreText: Phaser.GameObjects.Text;
    private score: number;
    private displayScore: number;

    constructor() {
        super({
            key: "HUDScene"
        });
    }

    create(): void {
        this.scoreText = this.add.text(400, 0, "");
        this.scoreText.setScrollFactor(0);

        this.score = 0;
        this.displayScore = 0;

        var game: Phaser.Scene = this.scene.get("MainScene");
        game.events.on("updateScore", this.updateScore.bind(this));
    }

    updateScore(): void {
        this.score = this.registry.get("score");
    }

    update(): void {
        if (this.displayScore < this.score) {
            this.displayScore++;
        }
        this.scoreText.setText(this.displayScore.toString());
    }
}