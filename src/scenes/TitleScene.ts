import { BaseButton } from "../gameobjects/buttons/BaseButton";

export class TitleScene extends Phaser.Scene {
    private menuButtons: BaseButton[];
    private title: Phaser.GameObjects.Text;
    private copyright: Phaser.GameObjects.Text;

    constructor() {
        super({
            key: "TitleScene"
        });
        this.menuButtons = [];
    }

    create(): void {
        var startBtn: BaseButton = new BaseButton(this, this.cameras.main.centerX - 60, this.cameras.main.centerY, "Start Game", this.startGame.bind(this));
        this.add.existing(startBtn);
        this.menuButtons.push(startBtn);
        this.title = this.add.text(this.cameras.main.centerX - 60, 100, "Lava Escape", {
            color: "#f00"
        });
        this.copyright = this.add.text(this.cameras.main.centerX - 60 - 40, this.cameras.main.height - 32, String.fromCharCode(169) + " 2019 James Cote", {
            color: "#fff"
        });
    }

    startGame(): void {
        this.scene.launch("MainScene");
        this.scene.sleep("TitleScene");
    }
}