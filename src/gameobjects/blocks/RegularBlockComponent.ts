import { Player } from "../Player";
import { BlockComponent } from "./BlockComponent";

export class RegularBlockComponent extends BlockComponent {
    constructor(player: Player) {
        super(player);
    }

    public runEffect() {
        if (this.player.active) {
            this.player.jump(this.block.getJumpFactor());
            this.player.lockOn(this.block);
        }
    }
}