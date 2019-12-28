import { Player } from "../Player";
import { BlockComponent } from "./BlockComponent";

export class BrokenBlockComponent extends BlockComponent {
    constructor(player: Player) {
        super(player);
    }

    public runEffect() {
        this.block.destroyBlock();
        this.player.setGrounded(false);
    }
}