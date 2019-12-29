export class HUDScene extends Phaser.Scene {
    private scoreText: Phaser.GameObjects.Text;
    private score: number;
    private displayScore: number;

    private pKey: Phaser.Input.Keyboard.Key;

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

        this.pKey = this.input.keyboard.addKey("P");
    }

    updateScore(): void {
        this.score = this.registry.get("score");
    }

    update(): void {
        if (this.input.keyboard.checkDown(this.pKey, 1000)) {
            if (!this.scene.isPaused("MainScene")) {
                this.scene.pause("MainScene");
            } else {
                this.scene.resume("MainScene");
            }
        }

        if (this.displayScore < this.score) {
            this.displayScore++;
        }
        this.scoreText.setText(this.displayScore.toString());
    }
}