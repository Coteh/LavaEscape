import "phaser";

import { Player } from "../src/gameobjects/Player";

import * as chai from "chai";
import { stub } from "sinon";
import * as sinonChai from "sinon-chai"
import { PlayerScene } from "./scenes/PlayerScene";
import { Block } from "../src/gameobjects/Block";
import { Game } from "phaser";

chai.use(sinonChai);
const expect = chai.expect;

class TestGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function dispatchKeyDown(keyCode) {
    window.dispatchEvent(new KeyboardEvent("keydown", {
        // @ts-ignore https://github.com/photonstorm/phaser/issues/2542
        keyCode: keyCode
    }));
}

describe("Player", () => {
    var game: Game;
    var scene: PlayerScene;
    var player: Player;
    var block: Block;
    var keyDown: EventListenerOrEventListenerObject;

    before((done) => {
        const config: Phaser.Types.Core.GameConfig = {
            title: "Lava Escape",
            width: 800,
            height: 600,
            scene: [PlayerScene],
            type: Phaser.AUTO,
            parent: "content",
            callbacks: {
                postBoot: function (_game) {
                    game = _game;
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
        window.removeEventListener("keydown", keyDown);
        scene.game.events.removeAllListeners("step");
    });

    it("should bounce from ground", async () => {
        const playerGroundedPos = block.getBounds().top - player.getBounds().height / 2;
        const playerJumpFunc = stub();
        expect(player.y).to.be.lessThan(playerGroundedPos);
        player.setOnJump(playerJumpFunc);
        console.log("actualFps => " + game.loop.actualFps);
        await delay(5000);
        expect(playerJumpFunc).to.have.been.calledOnce;
        expect(player.y).to.be.lessThan(playerGroundedPos);
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

    it("should be able to move left", (done) => {
        let isKeyPressed: boolean = false;
        keyDown = function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(37);
            setTimeout(() => {
                isKeyPressed = true;
            }, 1000);
        };
        window.addEventListener('keydown', keyDown);
        let currStep: number = 0;
        scene.game.events.on('step', () => {
            if (isKeyPressed) {
                expect(player.x).to.be.lessThan(0);
                done();
            } else {
                if (currStep === 0) {
                    expect(player.x).to.be.equal(0);
                    dispatchKeyDown(37);
                }
            }
            currStep++;
        });
    });

    it("should be able to move right", (done) => {
        let isKeyPressed: boolean = false;
        keyDown = function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(39);
            setTimeout(() => {
                isKeyPressed = true;
            }, 1000);
        }
        window.addEventListener('keydown', keyDown);
        let currStep: number = 0;
        scene.game.events.on('step', () => {
            if (isKeyPressed) {
                expect(player.x).to.be.greaterThan(0);
                done();
            } else {
                if (currStep === 0) {
                    expect(player.x).to.be.equal(0);
                    dispatchKeyDown(39);
                }
            }
            currStep++;
        });
    });

    it("should be able to fast fall", async () => {
        // Variables
        const startPlayerY: number = 100;
        let oldPlayerY: number;
        // Space callback
        keyDown = function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(32);
        }
        window.addEventListener('keydown', keyDown);
        // Precondition
        player.y = startPlayerY;
        await delay(1000);
        expect(player.y).to.be.greaterThan(startPlayerY);
        oldPlayerY = player.y;
        // Condition
        player.y = startPlayerY;
        dispatchKeyDown(32);
        await delay(1000);
        expect(player.y).to.be.greaterThan(oldPlayerY);
    });

    it("should stick to the ground if they fast fell", () => {
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