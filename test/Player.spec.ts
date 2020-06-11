import 'phaser';

import { Player } from '../src/gameobjects/Player';

import * as chai from 'chai';
import { stub } from 'sinon';
import * as sinonChai from 'sinon-chai';
import { PlayerScene } from './scenes/PlayerScene';
import { Block } from '../src/gameobjects/Block';
import { Game } from 'phaser';

chai.use(sinonChai);
const expect = chai.expect;

class TestGame extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

function dispatchKeyEvent(keyEvent: string, keyCode: any) {
    window.dispatchEvent(
        new KeyboardEvent(keyEvent, {
            // @ts-ignore https://github.com/photonstorm/phaser/issues/2542
            keyCode: keyCode,
        })
    );
}

function dispatchKeyDown(keyCode) {
    dispatchKeyEvent('keydown', keyCode);
}

function dispatchKeyUp(keyCode) {
    dispatchKeyEvent('keyup', keyCode);
}

describe('Player', () => {
    var game: Game;
    var scene: PlayerScene;
    var player: Player;
    var block: Block;
    var keyDown: EventListenerOrEventListenerObject;
    var keyUp: EventListenerOrEventListenerObject;

    function delay(ms) {
        return new Promise((resolve) => {
            scene.time.addEvent({
                delay: ms,
                callback: resolve,
            });
        });
    }

    function waitForGameEvent(eventName: string) {
        return new Promise((resolve) => {
            scene.events.addListener(eventName, () => {
                resolve();
            });
        });
    }

    before((done) => {
        const config: Phaser.Types.Core.GameConfig = {
            title: 'Lava Escape',
            width: 800,
            height: 600,
            scene: [PlayerScene],
            type: Phaser.HEADLESS,
            parent: 'content',
            callbacks: {
                postBoot: function (_game) {
                    game = _game;
                    scene = game.scene.getScene('MainScene') as PlayerScene;
                    scene.setOnSceneCreated(() => {
                        scene.setOnSceneCreated(null);
                        done();
                    });
                },
            },
        };
        new TestGame(config);
    });

    beforeEach(() => {
        scene.onTestStart((_player: Player, _block: Block) => {
            player = _player;
            block = _block;
        });
        window.removeEventListener('keydown', keyDown);
        window.removeEventListener('keyup', keyUp);
        scene.game.events.removeAllListeners('grounded');
    });

    it('should bounce from ground', async () => {
        const playerGroundedPos =
            block.getBounds().top - player.getBounds().height / 2;
        const playerJumpFunc = stub();
        expect(player.y).to.be.lessThan(playerGroundedPos);
        player.setOnJump(playerJumpFunc);
        await delay(1000);
        expect(playerJumpFunc).to.have.been.calledOnce;
        expect(player.y).to.be.lessThan(playerGroundedPos);
    });

    it('should fall down', async () => {
        const playerJumpFunc = stub();
        player.setOnJump(playerJumpFunc);
        expect(player.y).to.be.lessThan(block.getBounds().top);
        let oldPlayerY: number = player.y;
        await delay(500);
        expect(player.y).to.be.greaterThan(oldPlayerY);
        expect(playerJumpFunc).not.to.have.been.called;
    });

    it('should be able to move left', async () => {
        keyDown = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(37);
        });
        window.addEventListener('keydown', keyDown);
        expect(player.x).to.be.equal(0);
        dispatchKeyDown(37);
        expect(keyDown).to.have.been.calledOnce;
        await delay(500);
        expect(player.x).to.be.lessThan(0);
    });

    it('should be able to move right', async () => {
        keyDown = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(39);
        });
        window.addEventListener('keydown', keyDown);
        expect(player.x).to.be.equal(0);
        dispatchKeyDown(39);
        expect(keyDown).to.have.been.calledOnce;
        await delay(500);
        expect(player.x).to.be.greaterThan(0);
    });

    it('should be able to fast fall', async () => {
        // Variables
        const startPlayerY: number = -200;
        let oldPlayerY: number;
        // Space callbacks
        keyDown = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(32);
        });
        keyUp = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(32);
        });
        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);
        // Precondition
        player.y = startPlayerY;
        await delay(2000);
        expect(player.y).to.be.greaterThan(startPlayerY);
        oldPlayerY = player.y;
        // Condition
        player.y = startPlayerY;
        dispatchKeyDown(32);
        expect(keyDown).to.have.been.calledOnce;
        await delay(2000);
        expect(player.y).to.be.greaterThan(oldPlayerY);
        // Cleanup
        dispatchKeyUp(32);
    });

    it('should stick to the ground if they fast fell', async () => {
        // Constants
        const playerGroundedPos =
            block.getBounds().top - player.getBounds().height / 2;
        // Space callback
        keyDown = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(32);
        });
        keyUp = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(32);
        });
        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);
        // Precondition
        expect(player.y).to.be.lessThan(playerGroundedPos);
        dispatchKeyDown(32);
        expect(keyDown).to.have.been.calledOnce;
        console.log(player.getSpeed(), player.y, game.loop.delta);
        await delay(2000);
        console.log(player.getSpeed(), player.y, game.loop.delta);
        expect(player.y).to.be.equal(playerGroundedPos);
        // Condition
        await delay(1000);
        console.log(player.getSpeed(), player.y, game.loop.delta);
        expect(player.y).to.be.equal(playerGroundedPos);
        // Cleanup
        dispatchKeyUp(32);
    });

    it('should be able to jump higher if bouncing from fast fall', async () => {
        // Constants
        const playerGroundedPos =
            block.getBounds().top - player.getBounds().height / 2;
        let regularJumpHeight: number;
        // Jump callback
        const playerJumpFunc = stub();
        player.setOnJump(playerJumpFunc);
        // Space callbacks
        keyDown = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(32);
        });
        keyUp = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(32);
        });
        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);
        // Precondition
        player.y = -100;
        await waitForGameEvent('jump');
        expect(playerJumpFunc).to.have.been.calledOnce;
        await delay(1000);
        regularJumpHeight = playerGroundedPos - player.y;
        // Condition
        dispatchKeyDown(32);
        expect(keyDown).to.have.been.calledOnce;
        await waitForGameEvent('grounded');
        expect(player.y).to.be.equal(playerGroundedPos);
        dispatchKeyUp(32);
        expect(keyUp).to.have.been.calledOnce;
        await delay(1000);
        expect(playerGroundedPos - player.y).to.be.greaterThan(
            regularJumpHeight
        );
    });

    // TODO - works on its own but cannot coexist with other tests because delta spikes really high when it gets to this test
    // fix framerate issues and keep the player speed consistent
    // it("should eventually fall down again after charged jump", async () => {
    //     // Constants
    //     const playerGroundedPos = block.getBounds().top - player.getBounds().height / 2;
    //     // Space callbacks
    //     keyDown = stub().callsFake(function (e: KeyboardEvent) {
    //         expect(e.keyCode).to.equal(32);
    //     });
    //     keyUp = stub().callsFake(function (e: KeyboardEvent) {
    //         expect(e.keyCode).to.equal(32);
    //     });
    //     window.addEventListener('keydown', keyDown);
    //     window.addEventListener('keyup', keyUp);
    //     // Precondition
    //     player.y = -100;
    //     dispatchKeyDown(32);
    //     expect(keyDown).to.have.been.calledOnce;
    //     await waitForGameEvent("grounded");
    //     expect(player.y).to.be.equal(playerGroundedPos);
    //     dispatchKeyUp(32);
    //     expect(keyUp).to.have.been.calledOnce;
    //     // Ensure player has jumped before waiting to see if it grounded again
    //     await waitForGameEvent("jump");
    //     console.log("jumped!");
    //     // Test passes when player eventually lands again before test timeout
    //     await waitForGameEvent("grounded");
    // });

    // TODO either:
    // - decouple logic these three cases test for from MainScene
    // - create a test for MainScene (not going to be reliable since too much going on there)
    // - remove these test cases

    // it("should be able to collect pickup", () => {
    //     expect.fail("Not implemented");
    // });

    // it("should be knocked back when hitting falling obstacles", () => {
    //     expect.fail("Not implemented");
    // });

    // it("should not be able to move past horizontal boundaries", () => {
    //     expect.fail("Not implemented");
    // });
});
