export class DebugManager {
    private scene: Phaser.Scene;
    private debugTextGroup: Phaser.GameObjects.Group;
    private debugTexts: {};
    private y: number;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.debugTexts = {};
        this.y = 0;
        this.debugTextGroup = this.scene.add.group();
    }

    public addKey(key: string): void {
        this.debugTexts[key] = new Phaser.GameObjects.Text(this.scene, 0, this.y, "", {});
        this.debugTextGroup.add(this.debugTexts[key], true);
        this.debugTexts[key].setScrollFactor(0);
        this.y += 32;
    }

    public setText(key: string, text: string): void {
        this.debugTexts[key].setText(key + ": " + text);
    }

    public toggleVisibility(): void {
        this.debugTextGroup.toggleVisible();
    }
}