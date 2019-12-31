import { Block } from "../gameobjects/Block";

export interface BlockChunk {
    blocks: Block[],
    chunkStart: number,
    chunkHeight: number
};

export function destroyChunk(blockChunk: BlockChunk) {
    blockChunk.blocks.forEach(block => {
        block.destroy(true);
    });
};
