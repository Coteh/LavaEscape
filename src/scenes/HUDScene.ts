import { BaseButton } from '../gameobjects/buttons/BaseButton';

const GAME_OVER_SCREEN_OFFSET: number = -50;
const MAX_SPACE_TUTORIAL_DURATION: number = 5000;
const MAX_LAVA_WARN_COOLDOWN_MS: number = 5000;

export class HUDScene extends Phaser.Scene {
    private mainScene: Phaser.Scene;

    private scoreText: Phaser.GameObjects.Text;
    private highscoreText: Phaser.GameObjects.Text;
    private score: number;
    private highscore: number = 0;
    private displayScore: number;

    private pKey: Phaser.Input.Keyboard.Key;

    private pausedText: Phaser.GameObjects.Text;
    private resumeButton: BaseButton;

    private gameOverText: Phaser.GameObjects.Text;
    private beatHighscoreText: Phaser.GameObjects.Text;
    private playAgainButton: BaseButton;

    private spaceKeyImage: Phaser.GameObjects.Sprite;
    private elapsedSpaceTutorial: number = 0;

    private lavaWarnUI: Phaser.GameObjects.Group;
    private lavaWarnCooldown: number = 0;

    constructor() {
        super({
            key: 'HUDScene',
        });
    }

    preload(): void {
        this.load.image('space', './assets/img/SpaceKey.png');
        this.load.image('space_pressed', './assets/img/SpaceKey_pressed.png');
        this.load.image('warn_arrow', './assets/img/WarningArrow.png');
        this.load.image(
            'warn_arrow_flash',
            './assets/img/WarningArrow_flash.png'
        );
    }

    create(): void {
        this.add.text(10, 10, 'Score:');
        this.scoreText = this.add.text(120, 10, '0');
        this.add.text(10, 30, 'High Score:');
        this.highscoreText = this.add.text(120, 30, '0');
        if (this.registry.get('highscore')) {
            this.highscore = this.registry.get('highscore');
            this.highscoreText.setText(this.highscore.toString());
        }

        this.score = 0;
        this.displayScore = 0;

        this.mainScene = this.scene.get('MainScene');
        this.mainScene.events.on('updateScore', this.updateScore.bind(this));
        this.mainScene.events.on('gameOver', this.gameOver.bind(this));
        this.mainScene.events.on('tutorialStart', (tutorialNum) => {
            switch (tutorialNum) {
                default:
                    // 1
                    this.activateSpaceTutorial();
                    break;
            }
        });
        this.mainScene.events.on('lavaWarn', (lavaWarn, playerLava) => {
            if (playerLava > 600 && this.lavaWarnCooldown > 0) {
                return;
            }
            this.lavaWarnUI.setVisible(lavaWarn);
            if (lavaWarn) {
                this.lavaWarnCooldown = MAX_LAVA_WARN_COOLDOWN_MS;
            }
        });

        this.pKey = this.input.keyboard.addKey('P');

        this.pausedText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 40,
            'Paused'
        );
        this.pausedText.setVisible(false);
        this.resumeButton = new BaseButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Resume',
            this.resumeGame.bind(this)
        );
        this.add.existing(this.resumeButton);
        this.resumeButton.setVisible(false);

        this.gameOverText = this.add.text(
            350,
            this.cameras.main.centerY + GAME_OVER_SCREEN_OFFSET,
            'Game Over!'
        );
        this.gameOverText.setVisible(false);
        this.beatHighscoreText = this.add.text(
            280,
            this.cameras.main.centerY + 50 + GAME_OVER_SCREEN_OFFSET,
            'You got a new high score!'
        );
        this.beatHighscoreText.setVisible(false);
        this.playAgainButton = new BaseButton(
            this,
            350,
            this.cameras.main.centerY + 100 + GAME_OVER_SCREEN_OFFSET,
            'Play Again',
            this.restartGame.bind(this)
        );
        this.add.existing(this.playAgainButton);
        this.playAgainButton.setVisible(false);

        this.spaceKeyImage = this.add.sprite(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'space'
        );
        this.anims.create({
            key: 'space_tutorial',
            frames: [
                { key: 'space', frame: 0 },
                { key: 'space_pressed', frame: 0 },
            ],
            frameRate: 2,
            repeat: -1,
        });
        this.spaceKeyImage.play('space_tutorial');
        this.spaceKeyImage.setVisible(false);

        this.anims.create({
            key: 'lava_warn_animation',
            frames: [
                { key: 'warn_arrow', frame: 0 },
                { key: 'warn_arrow_flash', frame: 0 },
            ],
            frameRate: 2,
            repeat: -1,
        });

        this.lavaWarnUI = new Phaser.GameObjects.Group(this);

        for (let i = 0; i < 3; i++) {
            const lavaWarnSprite = new Phaser.GameObjects.Sprite(
                this,
                0,
                550,
                'warn_arrow'
            );
            lavaWarnSprite.play('lava_warn_animation');
            lavaWarnSprite.setScale(0.1);
            const lavaWarnSpacing = lavaWarnSprite.displayWidth * 3;
            lavaWarnSprite.setX(
                this.cameras.main.width / 2 -
                    (lavaWarnSpacing / 2) * 3 +
                    (lavaWarnSpacing / 2 + lavaWarnSpacing * i)
            );
            this.lavaWarnUI.add(lavaWarnSprite, true);
        }

        this.add.existing(this.lavaWarnUI);
        this.lavaWarnUI.setVisible(false);
    }

    updateScore(): void {
        this.score = this.registry.get('score');
    }

    update(time: number, delta: number): void {
        if (this.input.keyboard.checkDown(this.pKey, 1000)) {
            if (!this.scene.isPaused('MainScene')) {
                this.pauseGame();
            } else {
                this.resumeGame();
            }
        }

        if (this.displayScore < this.score / 2) {
            this.displayScore = Math.ceil(this.score / 2);
        } else if (this.displayScore < this.score) {
            this.displayScore =
                this.score - this.displayScore === 1
                    ? this.displayScore + 1
                    : this.displayScore + 2;
        }
        this.scoreText.setText(this.displayScore.toString());
        if (
            this.registry.get('beatHighscore') &&
            this.displayScore > this.highscore
        ) {
            this.highscoreText.setText(this.displayScore.toString());
        }

        if (this.elapsedSpaceTutorial > 0) {
            if (this.elapsedSpaceTutorial > MAX_SPACE_TUTORIAL_DURATION) {
                this.completeSpaceTutorial();
            } else {
                this.elapsedSpaceTutorial += delta;
            }
        }

        if (this.lavaWarnCooldown > 0) {
            this.lavaWarnCooldown -= delta;
        }
    }

    gameOver(): void {
        this.displayScore = this.score;
        this.gameOverText.setVisible(true);
        this.playAgainButton.setVisible(true);
        if (this.registry.get('beatHighscore')) {
            this.beatHighscoreText.setVisible(true);
        }
        this.spaceKeyImage.setVisible(false);
    }

    pauseGame(): void {
        this.scene.pause('MainScene');
        this.resumeButton.setVisible(true);
        this.pausedText.setVisible(true);
        this.spaceKeyImage.setVisible(false);
        this.anims.get('lava_warn_animation').pause();
    }

    resumeGame(): void {
        this.scene.resume('MainScene');
        this.resumeButton.setVisible(false);
        this.pausedText.setVisible(false);
        this.spaceKeyImage.setVisible(this.elapsedSpaceTutorial > 0);
        this.anims.get('lava_warn_animation').resume();
    }

    restartGame(): void {
        this.scene.start('MainScene');
    }

    activateSpaceTutorial(): void {
        this.spaceKeyImage.setVisible(true);
        this.elapsedSpaceTutorial = 0.000001;
    }

    completeSpaceTutorial(): void {
        this.spaceKeyImage.setVisible(false);
        // TODO this creates a bidirectional flow between MainScene and HUDScene,
        // any way this can be done better?
        this.mainScene.events.emit('completeTutorial', 1);
    }
}
