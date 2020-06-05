import "phaser";

import { Player } from "../src/gameobjects/Player";

import { expect } from "chai";
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
                    scene = game.scene.getScene("MainScene") as PlayerScene;
                    scene.setOnSceneCreated(() => {
                        done();
                    });
                }
            }
        }
        new TestGame(config);
    });

    beforeEach(() => {
        scene.onTestStart((_player: Player, _block: Block) => {
            player = _player;
            block = _block;
        });
    });

    it("should bounce from ground", (done) => {
        var playerGroundedPos = block.getBounds().top - player.getBounds().height / 2;
        expect(player.y).to.be.lessThan(playerGroundedPos);
        player.setOnJump((player) => {
           setTimeout(() => {
               expect(player.y).to.be.lessThan(playerGroundedPos);
               done();
           }, 1000);
        });
    });

    it("should fall down", (done) => {
        let oldPlayerY: number;
        let currStep: number = 0;
        scene.game.events.on('step', () => {
            switch (currStep) {
                case 0:
                    expect(player.y).to.be.lessThan(block.getBounds().top);
                    oldPlayerY = player.y;
                    break;
                case 1:
                    expect(player.y).to.be.greaterThan(oldPlayerY);
                    done(); 
                    break;
            }
            currStep++;
        });
    });

    it("should be able to move left", () => {
        expect.fail("Not implemented");
    });

    it("should be able to move right", () => {
        expect.fail("Not implemented");
    });

    it("should be able to fast fall", () => {
        expect.fail("Not implemented");
    });

    it("should be able to jump higher if bouncing from fast fall", () => {
        expect.fail("Not implemented");
    });

    it("should be able to collect pickup", () => {
        expect.fail("Not implemented");
    });

    it("should be knocked back when hitting falling obstacles", () => {
        expect.fail("Not implemented");
    });

    it("should not be able to move past horizontal boundaries", () => {
        expect.fail("Not implemented");
    });
});