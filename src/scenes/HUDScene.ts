import { BaseButton } from "../gameobjects/buttons/BaseButton";

const GAME_OVER_SCREEN_OFFSET: number = -50;

export class HUDScene extends Phaser.Scene {
    private scoreText: Phaser.GameObjects.Text;
    private score: number;
    private displayScore: number;

    private pKey: Phaser.Input.Keyboard.Key;

    private pausedText: Phaser.GameObjects.Text;
    private resumeButton: BaseButton;

    private gameOverText: Phaser.GameObjects.Text;
    private beatHighscoreText: Phaser.GameObjects.Text;
    private playAgainButton: BaseButton;

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

        var mainScene: Phaser.Scene = this.scene.get("MainScene");
        mainScene.events.on("updateScore", this.updateScore.bind(this));
        mainScene.events.on("gameOver", this.gameOver.bind(this));

        this.pKey = this.input.keyboard.addKey("P");

        this.pausedText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 40, "Paused");
        this.pausedText.setVisible(false);
        this.resumeButton = new BaseButton(this, this.cameras.main.centerX, this.cameras.main.centerY, "Resume", this.resumeGame.bind(this));
        this.add.existing(this.resumeButton);
        this.resumeButton.setVisible(false);

        this.gameOverText = this.add.text(350, this.cameras.main.centerY + GAME_OVER_SCREEN_OFFSET, "Game Over!");
        this.gameOverText.setVisible(false);
        this.beatHighscoreText = this.add.text(280, this.cameras.main.centerY + 50 + GAME_OVER_SCREEN_OFFSET, "You got a new high score!");
        this.beatHighscoreText.setVisible(false);
        this.playAgainButton = new BaseButton(this, 350, this.cameras.main.centerY + 100 + GAME_OVER_SCREEN_OFFSET, "Play Again", this.restartGame.bind(this));
        this.add.existing(this.playAgainButton);
        this.playAgainButton.setVisible(false);
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
        this.gameOverText.setVisible(true);
        this.playAgainButton.setVisible(true);
        if (this.registry.get("beatHighscore")) {
            this.beatHighscoreText.setVisible(true);
        }
    }

    pauseGame(): void {
        this.scene.pause("MainScene");
        this.resumeButton.setVisible(true);
        this.pausedText.setVisible(true);
    }

    resumeGame(): void {
        this.scene.resume("MainScene");
        this.resumeButton.setVisible(false);
        this.pausedText.setVisible(false);
    }

    restartGame(): void {
        this.scene.start("MainScene");
    }
}