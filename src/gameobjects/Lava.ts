import { Player } from "./Player";

export class Lava extends Phaser.GameObjects.Rectangle {
    private player: Player;

    private lavaForgiveness: number = 2000;

    private movingDown: boolean;
    private movingDownDist: number;
    private lavaReductionSpeed: number = -1;

    private gameOver: boolean;
    private timeToInactive: number = 0;

    constructor(scene: Phaser.Scene, y: number, height: number, player: Player) {
        super(scene, 250, y, 2000, height, 0xff0000, 1); // TODO scale lava height based on game dimensions
        this.player = player;
    }

    public update(time: number, delta: number): void {
        if (this.gameOver) {
            if (this.timeToInactive > 2000) {
                return;
            }
            this.timeToInactive += delta;
        }
        var playerLava = (this.y - this.player.y);
        this.scene.events.emit("debug", "playerlava", playerLava.toString());
        var lavaSpeed = (this.movingDown) ? this.lavaReductionSpeed : Math.abs(playerLava / this.lavaForgiveness);
        this.scene.events.emit("debug", "lavaSpeed", lavaSpeed.toString());
        this.y -= 0.3 * lavaSpeed * delta;
        this.scene.events.emit("debug", "lavaForgiveness", this.lavaForgiveness.toString());
        if (this.y > this.movingDownDist) {
            this.movingDown = false;
        }
    }

    public speedUp(factor: number) {
        if (this.lavaForgiveness > 1) {
            this.lavaForgiveness -= factor;
        }
    }

    public moveDown(dist: number) {
        this.movingDown = true;
        this.movingDownDist = this.y + dist;
    }

    public setGameOverSpeed() {
        this.lavaForgiveness = 4000;
        this.gameOver = true;
    }
}