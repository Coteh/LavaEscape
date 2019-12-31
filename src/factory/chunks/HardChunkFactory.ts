import { ChunkResult } from "./AbstractChunkFactory";
import { Pickup } from "../../gameobjects/Pickup";
import { Block } from "../../gameobjects/Block";
import { Scene } from "phaser";
import { Player } from "../../gameobjects/Player";
import { RegularBlockComponent } from "../../gameobjects/blocks/RegularBlockComponent";
import { getManualBounds } from "../../util/Bounds";
import { ChunkHelper } from "../../util/ChunkHelper";

export class HardChunkFactory {
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
    
    createChunk(x: number, y: number): ChunkResult {
        var blocks: Block[] = [];
        var pickups: Pickup[] = [];
        for (let i = 0; i < 10; i++) {
            var block: Block = new Block(this.scene, x + ChunkHelper.randomOffset(), y - (i * 200), 20, 20, "reg_platform", 1, new RegularBlockComponent(this.player), 0);
            block.setPlayerReference(this.player);
            block.setPlayerCollideFunc(this.playerCollisionFunc);
            blocks.push(block);
            var rand = Math.round(Math.random() * 10);
            if (rand % 10 == 5) {
                var blockBounds = getManualBounds(block);
                var pickup: Pickup = new Pickup(this.scene, block.x + blockBounds.width / 2, block.y - blockBounds.height / 2 - 30, 60, 60, "lava_sink", this.onPickupFunc);
                pickups.push(pickup);
            }
            // if (i % 2 == 0) {
            //     var block: Block = new Block(this.scene, this.randomOffset(), starting - (i * 250), 100, 20, 0x00ff00, 2, new BrokenBlockComponent(this.player), 0);
            //     block.setPlayerReference(this.player);
            //     block.setPlayerCollideFunc(this.playerCollisionFunc);
            //     blocks.push(block);
            // }
            var block: Block = new Block(this.scene, x + ChunkHelper.randomOffset(), y - (i * 300), 20, 20, "reg_platform", 1, new RegularBlockComponent(this.player), 0);
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