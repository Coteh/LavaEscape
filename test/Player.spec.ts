import 'phaser';

import { Player } from '../src/gameobjects/Player';

import * as chai from 'chai';
import { stub } from 'sinon';
import * as sinonChai from 'sinon-chai';
import { PlayerScene } from './scenes/PlayerScene';
import { Block } from '../src/gameobjects/Block';
import KeyEvent from './lib/KeyEvent';
import PhaserTester from './lib/PhaserTester';
import { KeyCodes } from './lib/TestConstants';

chai.use(sinonChai);
const expect = chai.expect;

describe('Player', () => {
    var scene: PlayerScene;
    var player: Player;
    var block: Block;

    let phaserTester: PhaserTester<PlayerScene>;

    before(async () => {
        phaserTester = new PhaserTester(PlayerScene);
        await phaserTester.setup();
        scene = phaserTester.getScene();
    });

    beforeEach(function () {
        phaserTester.startTestCase(
            this.currentTest.title,
            (_player: Player, _block: Block) => {
                player = _player;
                block = _block;
            }
        );
    });

    it('should bounce from ground', async () => {
        const playerGroundedPos =
            block.getBounds().top - player.getBounds().height / 2;
        const playerJumpFunc = stub();
        expect(player.y).to.be.lessThan(playerGroundedPos);
        player.setOnJump(playerJumpFunc);
        await phaserTester.delay(1000);
        expect(playerJumpFunc).to.have.been.calledOnce;
        expect(player.y).to.be.lessThan(playerGroundedPos);
    });

    it('should fall down', async () => {
        const playerJumpFunc = stub();
        player.setOnJump(playerJumpFunc);
        expect(player.y).to.be.lessThan(block.getBounds().top);
        let oldPlayerY: number = player.y;
        await phaserTester.delay(500);
        expect(player.y).to.be.greaterThan(oldPlayerY);
        expect(playerJumpFunc).not.to.have.been.called;
    });

    it('should be able to move left', async () => {
        phaserTester.keyDown = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(KeyCodes.LEFT_ARROW);
        });
        window.addEventListener('keydown', phaserTester.keyDown);
        expect(player.x).to.be.equal(0);
        KeyEvent.dispatchKeyDown(KeyCodes.LEFT_ARROW);
        expect(phaserTester.keyDown).to.have.been.calledOnce;
        await phaserTester.delay(500);
        expect(player.x).to.be.lessThan(0);
        // Cleanup
        KeyEvent.dispatchKeyUp(KeyCodes.LEFT_ARROW);
    });

    it('should be able to move right', async () => {
        phaserTester.keyDown = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(KeyCodes.RIGHT_ARROW);
        });
        window.addEventListener('keydown', phaserTester.keyDown);
        expect(player.x).to.be.equal(0);
        KeyEvent.dispatchKeyDown(KeyCodes.RIGHT_ARROW);
        expect(phaserTester.keyDown).to.have.been.calledOnce;
        await phaserTester.delay(500);
        expect(player.x).to.be.greaterThan(0);
        // Cleanup
        KeyEvent.dispatchKeyUp(KeyCodes.RIGHT_ARROW);
    });

    it('should be able to fast fall', async () => {
        // Variables
        const startPlayerY: number = -200;
        let oldPlayerY: number;
        // Space callbacks
        phaserTester.keyDown = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(KeyCodes.SPACE_BAR);
        });
        phaserTester.keyUp = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(KeyCodes.SPACE_BAR);
        });
        window.addEventListener('keydown', phaserTester.keyDown);
        window.addEventListener('keyup', phaserTester.keyUp);
        // Precondition
        player.y = startPlayerY;
        await phaserTester.delay(2000);
        expect(player.y).to.be.greaterThan(startPlayerY);
        oldPlayerY = player.y;
        // Condition
        player.y = startPlayerY;
        KeyEvent.dispatchKeyDown(KeyCodes.SPACE_BAR);
        expect(phaserTester.keyDown).to.have.been.calledOnce;
        await phaserTester.delay(2000);
        expect(player.y).to.be.greaterThan(oldPlayerY);
        // Cleanup
        KeyEvent.dispatchKeyUp(KeyCodes.SPACE_BAR);
    });

    it('should stick to the ground if they fast fell', async () => {
        // Constants
        const playerGroundedPos =
            block.getBounds().top - player.getBounds().height / 2;
        // Space callback
        phaserTester.keyDown = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(KeyCodes.SPACE_BAR);
        });
        phaserTester.keyUp = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(KeyCodes.SPACE_BAR);
        });
        window.addEventListener('keydown', phaserTester.keyDown);
        window.addEventListener('keyup', phaserTester.keyUp);
        // Precondition
        expect(player.y).to.be.lessThan(playerGroundedPos);
        KeyEvent.dispatchKeyDown(KeyCodes.SPACE_BAR);
        expect(phaserTester.keyDown).to.have.been.calledOnce;
        await phaserTester.delay(2000);
        expect(player.y).to.be.equal(playerGroundedPos);
        // Condition
        await phaserTester.delay(1000);
        expect(player.y).to.be.equal(playerGroundedPos);
        // Cleanup
        KeyEvent.dispatchKeyUp(KeyCodes.SPACE_BAR);
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
        phaserTester.keyDown = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(KeyCodes.SPACE_BAR);
        });
        phaserTester.keyUp = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(KeyCodes.SPACE_BAR);
        });
        window.addEventListener('keydown', phaserTester.keyDown);
        window.addEventListener('keyup', phaserTester.keyUp);
        // Precondition
        player.y = -100;
        await phaserTester.waitForGameEvent('jump');
        expect(playerJumpFunc).to.have.been.calledOnce;
        await phaserTester.delay(1000);
        regularJumpHeight = playerGroundedPos - player.y;
        // Condition
        KeyEvent.dispatchKeyDown(KeyCodes.SPACE_BAR);
        expect(phaserTester.keyDown).to.have.been.calledOnce;
        await phaserTester.waitForGameEvent('grounded');
        expect(player.y).to.be.equal(playerGroundedPos);
        KeyEvent.dispatchKeyUp(KeyCodes.SPACE_BAR);
        expect(phaserTester.keyUp).to.have.been.calledOnce;
        await phaserTester.delay(1000);
        expect(playerGroundedPos - player.y).to.be.greaterThan(
            regularJumpHeight
        );
    });

    it('should eventually fall down again after charged jump', async () => {
        // Constants
        const playerGroundedPos =
            block.getBounds().top - player.getBounds().height / 2;
        // Space callbacks
        phaserTester.keyDown = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(KeyCodes.SPACE_BAR);
        });
        phaserTester.keyUp = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(KeyCodes.SPACE_BAR);
        });
        window.addEventListener('keydown', phaserTester.keyDown);
        window.addEventListener('keyup', phaserTester.keyUp);
        // Precondition
        player.y = -100;
        KeyEvent.dispatchKeyDown(KeyCodes.SPACE_BAR);
        expect(phaserTester.keyDown).to.have.been.calledOnce;
        await phaserTester.waitForGameEvent('grounded');
        expect(player.y).to.be.equal(playerGroundedPos);
        KeyEvent.dispatchKeyUp(KeyCodes.SPACE_BAR);
        expect(phaserTester.keyUp).to.have.been.calledOnce;
        // Ensure player has jumped before waiting to see if it grounded again
        await phaserTester.waitForGameEvent('jump');
        // Test passes when player eventually lands again before test timeout
        await phaserTester.waitForGameEvent('grounded');
    });

    // TODO either:
    // - decouple logic these three cases test for from MainScene
    // - create a test for MainScene (not going to be reliable since too much going on there)
    // - remove these test cases

    it('should be able to collect pickup', () => {
        expect.fail('Not implemented');
    });

    it('should be knocked back when hitting falling obstacles', () => {
        expect.fail('Not implemented');
    });

    afterEach(() => {
        phaserTester.endTestCase();
    });

    after(() => {
        phaserTester.deinit();
    });
});
