import { Scene } from "phaser";
import { Block } from "../../gameobjects/Block";
import { Player } from "../../gameobjects/Player";
import { Pickup } from "../../gameobjects/Pickup";
import { HardChunkFactory } from "./HardChunkFactory";
import { NormalChunkFactory } from "./NormalChunkFactory";
import { MovingChunkFactory } from "./MovingChunkFactory";

export interface ChunkResult {
    blocks: Block[];
    pickups: Pickup[];
}

export interface ChunkFactory {
    createChunk(x: number, y: number): ChunkResult;
}

const HARD_CHUNKS_MIN: number = 5;

export class AbstractChunkFactory {
    private scene: Scene;
    private numberChunksCreated: number = 0;

    private chunkFactories: ChunkFactory[];

    constructor(scene: Scene, player: Player, playerCollisionFunc: Function, onPickupFunc: Function) {
        this.scene = scene;
        this.chunkFactories = [];
        this.chunkFactories.push(new NormalChunkFactory(scene, player, playerCollisionFunc, onPickupFunc));
        this.chunkFactories.push(new MovingChunkFactory(scene, player, playerCollisionFunc, onPickupFunc));
        this.chunkFactories.push(new HardChunkFactory(scene, player, playerCollisionFunc, onPickupFunc));
    }

    createChunk(x: number, y: number): ChunkResult {
        var rand: number = Math.round(Math.random() * 2);
        var result: ChunkResult;
        switch (rand) {
            case 1:
                result = this.chunkFactories[1].createChunk(x, y);
                break;
            case 2:
                if (this.numberChunksCreated > HARD_CHUNKS_MIN) {
                    result = this.chunkFactories[2].createChunk(x, y);
                    break;
                }
            default:
                result = this.chunkFactories[0].createChunk(x, y);
                break;
        }
        result.blocks.forEach(block => {
            this.scene.add.existing(block);
        });
        result.pickups.forEach(pickup => {
            this.scene.add.existing(pickup);
        });
        this.numberChunksCreated++;
        return result;
    }
}