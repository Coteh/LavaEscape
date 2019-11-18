export class DebugManager {
    private scene: Phaser.Scene;
    private debugTexts: {};
    private y: number;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.debugTexts = {};
        this.y = 0;
    }

    public addKey(key: string) {
        this.debugTexts[key] = this.scene.add.text(0, this.y, "");
        this.debugTexts[key].setScrollFactor(0);
        this.y += 32;
    }

    public setText(key: string, text: string) {
        this.debugTexts[key].setText(key + ": " + text);
    }
}