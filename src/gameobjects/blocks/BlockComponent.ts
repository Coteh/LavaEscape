import { Player } from '../Player';
import { Block } from '../Block';

export class BlockComponent {
    protected player: Player;
    protected block: Block;

    constructor(player: Player) {
        this.player = player;
    }

    public setBlock(block: Block) {
        this.block = block;
    }

    public runEffect() {}
}
