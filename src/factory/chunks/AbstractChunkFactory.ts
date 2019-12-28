import { Scene } from "phaser";
import { Block } from "../../gameobjects/Block";
import { Player } from "../../gameobjects/Player";
import { Pickup } from "../../gameobjects/Pickup";
import { EasyChunkFactory } from "./EasyChunkFactory";
import { NormalChunkFactory } from "./NormalChunkFactory";
import { MovingChunkFactory } from "./MovingChunkFactory";

export interface ChunkResult {
    blocks: Block[];
    pickups: Pickup[];
}

export interface ChunkFactory {
    createChunk(starting: number): ChunkResult;
}

export class AbstractChunkFactory {
    private scene: Scene;

    private chunkFactories: ChunkFactory[];

    constructor(scene: Scene, player: Player, playerCollisionFunc: Function, onPickupFunc: Function) {
        this.scene = scene;
        this.chunkFactories = [];
        this.chunkFactories.push(new EasyChunkFactory(scene, player, playerCollisionFunc, onPickupFunc));
        this.chunkFactories.push(new NormalChunkFactory(scene, player, playerCollisionFunc, onPickupFunc));
        this.chunkFactories.push(new MovingChunkFactory(scene, player, playerCollisionFunc, onPickupFunc));
    }

    randomPosition(): number {
        return Math.random() * 300 + 200;
    }

    createChunk(starting: number): ChunkResult {
        var rand: number = Math.round(Math.random() * 2);
        var result: ChunkResult;
        switch (rand) {
            case 1:
                result = this.chunkFactories[1].createChunk(starting);
                break;
            case 2:
                result = this.chunkFactories[2].createChunk(starting);
                break;
            default:
                result = this.chunkFactories[0].createChunk(starting);
                break;
        }
        result.blocks.forEach(block => {
            this.scene.add.existing(block);
        });
        result.pickups.forEach(pickup => {
            this.scene.add.existing(pickup);
        });
        return result;
    }
}