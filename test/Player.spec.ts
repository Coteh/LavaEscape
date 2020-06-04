import "phaser";

import { Player } from "../src/gameobjects/Player";

import { assert } from "chai";
import { PlayerScene } from "./scenes/PlayerScene";
import { Block } from "../src/gameobjects/Block";

class TestGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

describe("Player", () => {
    var scene: PlayerScene;
    var player: Player;
    var block: Block;

    before((done) => {
        const config: Phaser.Types.Core.GameConfig = {
            title: "Lava Escape",
            width: 800,
            height: 600,
            scene: [PlayerScene],
            type: Phaser.AUTO,
            parent: "content",
            callbacks: {
                postBoot: function (game) {
                    scene = game.scene.getScene("PlayerScene") as PlayerScene;
                    scene.setOnSceneCreated((_player: Player, _block: Block) => {
                        player = _player;
                        block = _block;
                        done();
                    });
                }
            }
        }
        new TestGame(config);
    });

    it("should bounce from ground", (done) => {
        var playerGroundedPos = block.getBounds().top - player.getBounds().height / 2;
        assert(player.y < playerGroundedPos);
        player.setOnJump((player) => {
           setTimeout(() => {
               assert(player.y < playerGroundedPos);
               done();
           }, 1000);
        });
    });

    it("should fall down", () => {
        assert.fail("Not implemented");
    });

    it("should be able to move left", () => {
        assert.fail("Not implemented");
    });

    it("should be able to move right", () => {
        assert.fail("Not implemented");
    });

    it("should be able to fast fall", () => {
        assert.fail("Not implemented");
    });

    it("should be able to jump higher if bouncing from fast fall", () => {
        assert.fail("Not implemented");
    });

    it("should be able to collect pickup", () => {
        assert.fail("Not implemented");
    });

    it("should be knocked back when hitting falling obstacles", () => {
        assert.fail("Not implemented");
    });

    it("should not be able to move past horizontal boundaries", () => {
        assert.fail("Not implemented");
    });
});