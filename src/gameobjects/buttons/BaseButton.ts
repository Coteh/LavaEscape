import { Scene } from "phaser";

export class BaseButton extends Phaser.GameObjects.Text {
    constructor(scene: Scene, x: number, y: number, text: string, callback: Function) {
        super(scene, x, y, text, {
            color: "#0f0"
        });
        this.setInteractive();
        this.on("pointerup", callback);
    }
}
