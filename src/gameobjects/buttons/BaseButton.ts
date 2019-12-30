import { Scene } from "phaser";

const NORMAL_COLOR: string = "#fff";
const HOVER_COLOR: string = "#ff0";
const HOLD_COLOR: string = "#0f0";

export class BaseButton extends Phaser.GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, text: string, callback: Function) {
        super(scene, x, y, text, {
            color: NORMAL_COLOR
        });
        this.setInteractive();
        this.on("pointerup", callback);
        this.on("pointerover", this.highlightButton);
        this.on("pointerout", this.unhighlightButton);
        this.on("pointerdown", this.holdDownButton);
    }

    highlightButton() {
        this.setColor(HOVER_COLOR);
    }

    unhighlightButton() {
        this.setColor(NORMAL_COLOR);
    }

    holdDownButton() {
        this.setColor(HOLD_COLOR);
    }
}
