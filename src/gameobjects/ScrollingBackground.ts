import { Scene } from 'phaser';
import { Player } from './Player';

const NEW_BACKGROUND_THRESHOLD: number = -10;
const SCROLLING_BG_SLOWNESS_FACTOR: number = 100;

export class ScrollingBackground extends Phaser.GameObjects.GameObject {
    private backgrounds: Phaser.GameObjects.Image[];
    private imageName: string;
    private player: Player;
    private oldPlayerY: number;

    constructor(scene: Scene, imageName: string) {
        super(scene, 'scrolling_background');
        this.backgrounds = [];
        this.imageName = imageName;
        var backgroundOffset: number =
            this.scene.cameras.main.height -
            this.scene.textures.get(imageName).get(0).height;
        this.addBackground(backgroundOffset);
    }

    public getNumberOfBackgroundTiles(): number {
        return this.backgrounds.length;
    }

    public getActiveBackgroundY(): number {
        return this.backgrounds[this.backgrounds.length - 1].y;
    }

    private addBackground(offset: number): void {
        var background = this.scene.add.image(0, offset, this.imageName);
        background.setScrollFactor(0);
        background.setOrigin(0);
        background.setDepth(-1000);
        this.backgrounds.push(background);
    }

    public followPlayer(player: Player): void {
        this.player = player;
        this.oldPlayerY = player.y;
    }

    update(time: number, delta: number): void {
        var playerYDiff = this.player.y - this.oldPlayerY;
        this.backgrounds.forEach((bg) => {
            bg.y -= playerYDiff / SCROLLING_BG_SLOWNESS_FACTOR;
        });
        var topBackground: number = this.backgrounds.length - 1;
        if (this.backgrounds[topBackground].y >= NEW_BACKGROUND_THRESHOLD) {
            this.addBackground(
                -this.backgrounds[topBackground].displayHeight -
                    this.backgrounds[topBackground].y
            );
        }
        if (this.backgrounds[0].y >= this.backgrounds[0].displayHeight * 2) {
            this.backgrounds[0].destroy(true);
            this.backgrounds = this.backgrounds.slice(1);
        }
        this.oldPlayerY = this.player.y;
    }
}
