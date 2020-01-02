import { BaseButton } from "../gameobjects/buttons/BaseButton";
import { Lava } from "../gameobjects/Lava";
import { AbstractChunkFactory } from "../factory/chunks/AbstractChunkFactory";
import { Pickup } from "../gameobjects/Pickup";

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

    preload(): void {
        this.load.image("reg_platform", "./assets/img/Platform.png");
    }

    create(): void {
        var startBtn: BaseButton = new BaseButton(this, this.cameras.main.centerX - 60, this.cameras.main.centerY, "Start Game", this.startGame.bind(this));
        this.add.existing(startBtn);
        this.menuButtons.push(startBtn);
        this.title = this.add.text(this.cameras.main.centerX - 60, 100, "Lava Escape", {
            color: "#f00"
        });
        this.copyright = this.add.text(this.cameras.main.centerX - 60 - 40, this.cameras.main.height - 32, String.fromCharCode(169) + " 2019-2020 James Cote", {
            color: "#fff"
        });
        var lava = new Lava(this, 800, 500, null);
        this.add.existing(lava);
        lava.setDepth(-500);
        var factory = new AbstractChunkFactory(this, null, null, null);
        var chunk = factory.createChunk(-200, 500);
        chunk.blocks.forEach(block => {
            this.add.existing(block);
            block.setDepth(-300);
        });
        chunk.pickups.forEach(pickup => {
            this.add.existing(pickup);
            pickup.setDepth(-300);
        });
    }

    startGame(): void {
        this.scene.launch("MainScene");
        this.scene.sleep("TitleScene");
    }
}