import { BaseButton } from "../gameobjects/buttons/BaseButton";

export class HUDScene extends Phaser.Scene {
    private scoreText: Phaser.GameObjects.Text;
    private score: number;
    private displayScore: number;

    private pKey: Phaser.Input.Keyboard.Key;

    private resumeButton: BaseButton;

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
        game.events.on("gameOver", this.gameOver.bind(this));

        this.pKey = this.input.keyboard.addKey("P");

        this.resumeButton = new BaseButton(this, this.cameras.main.centerX, this.cameras.main.centerY, "Resume", this.resumeGame.bind(this));
        this.add.existing(this.resumeButton);
        this.resumeButton.setVisible(false);
    }

    updateScore(): void {
        this.score = this.registry.get("score");
    }

    update(): void {
        if (this.input.keyboard.checkDown(this.pKey, 1000)) {
            if (!this.scene.isPaused("MainScene")) {
                this.pauseGame();
            } else {
                this.resumeGame();
            }
        }

        if (this.displayScore < this.score / 2) {
            this.displayScore += 2;
        } else if (this.displayScore < this.score) {
            this.displayScore++;
        }
        this.scoreText.setText(this.displayScore.toString());
    }

    gameOver(): void {
        this.displayScore = this.score;
    }

    pauseGame(): void {
        this.scene.pause("MainScene");
        this.resumeButton.setVisible(true);
    }

    resumeGame(): void {
        this.scene.resume("MainScene");
        this.resumeButton.setVisible(false);
    }
}