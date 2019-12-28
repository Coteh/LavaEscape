import { ChunkResult } from "./AbstractChunkFactory";
import { Pickup } from "../../gameobjects/Pickup";
import { Block } from "../../gameobjects/Block";
import { Scene } from "phaser";
import { Player } from "../../gameobjects/Player";
import { RegularBlockComponent } from "../../gameobjects/blocks/RegularBlockComponent";

export class MovingChunkFactory {
    private scene: Scene;
    private player: Player;
    private playerCollisionFunc: Function;
    private onPickupFunc: Function;

    constructor(scene: Scene, player: Player, playerCollisionFunc: Function, onPickupFunc: Function) {
        this.scene = scene;
        this.player = player;
        this.playerCollisionFunc = playerCollisionFunc;
        this.onPickupFunc = onPickupFunc;
    }

    randomPosition(): number {
        return Math.random() * 300 + 200;
    }

    randomSpeed(): number {
        return Math.random() * 1 + 0.25;
    }

    createChunk(starting: number): ChunkResult {
        var blocks: Block[] = [];
        var pickups: Pickup[] = [];
        for (let i = 0; i < 10; i++) {
            var block: Block = new Block(this.scene, this.randomPosition(), starting - (i * 200), 100, 20, 0xff0000, 1, new RegularBlockComponent(this.player), this.randomSpeed());
            block.setPlayerReference(this.player);
            block.setPlayerCollideFunc(this.playerCollisionFunc);
            blocks.push(block);
            var rand = Math.round(Math.random() * 10);
            if (rand % 10 == 5) {
                var pickup: Pickup = new Pickup(this.scene, block.x + block.getBounds().width / 2, block.y - block.getBounds().height / 2 - 30, 60, 60, "lava_sink", this.onPickupFunc);
                pickups.push(pickup);
            }
            // if (i % 2 == 0) {
            //     var block: Block = new Block(this.scene, this.randomPosition(), starting - (i * 250), 100, 20, 0x00ff00, 2, new BrokenBlockComponent(this.player), 0);
            //     block.setPlayerReference(this.player);
            //     block.setPlayerCollideFunc(this.playerCollisionFunc);
            //     blocks.push(block);
            // }
            var block: Block = new Block(this.scene, this.randomPosition(), starting - (i * 300), 20, 20, 0x654321, 1, new RegularBlockComponent(this.player), 0);
            block.setPlayerReference(this.player);
            block.setPlayerCollideFunc(this.playerCollisionFunc);
            blocks.push(block);
        }
        return {
            blocks,
            pickups
        };
    }
}