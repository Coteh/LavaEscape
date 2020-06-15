import 'phaser';

import { Player } from '../src/gameobjects/Player';

import * as chai from 'chai';
import { stub } from 'sinon';
import * as sinonChai from 'sinon-chai';
import { PlayerScene } from './scenes/PlayerScene';
import { Block } from '../src/gameobjects/Block';
import KeyEvent from './lib/KeyEvent';
import PhaserTester from './lib/PhaserTester';

chai.use(sinonChai);
const expect = chai.expect;

describe('Player', () => {
    var scene: PlayerScene;
    var player: Player;
    var block: Block;
    var keyDown: EventListenerOrEventListenerObject;
    var keyUp: EventListenerOrEventListenerObject;

    let phaserTester: PhaserTester<PlayerScene>;

    before(async () => {
        phaserTester = new PhaserTester(PlayerScene);
        await phaserTester.setup();
        scene = phaserTester.getScene();
    });

    beforeEach(function () {
        scene.onTestStart((_player: Player, _block: Block) => {
            player = _player;
            block = _block;
        });
        window.removeEventListener('keydown', keyDown);
        window.removeEventListener('keyup', keyUp);
        phaserTester.onTestStart(this.currentTest.title);
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
        keyDown = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(37);
        });
        window.addEventListener('keydown', keyDown);
        expect(player.x).to.be.equal(0);
        KeyEvent.dispatchKeyDown(37);
        expect(keyDown).to.have.been.calledOnce;
        await phaserTester.delay(500);
        expect(player.x).to.be.lessThan(0);
        // Cleanup
        KeyEvent.dispatchKeyUp(37);
    });

    it('should be able to move right', async () => {
        keyDown = stub().callsFake(function (e: KeyboardEvent) {
            expect(e.keyCode).to.equal(39);
        });
        window.addEventListener('keydown', keyDown);
        expect(player.x).to.be.equal(0);
        KeyEvent.dispatchKeyDown(39);
        expect(keyDown).to.have.been.calledOnce;
        await phaserTester.delay(500);
        expect(player.x).to.be.greaterThan(0);
        // Cleanup
        KeyEvent.dispatchKeyUp(39);
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
        await phaserTester.delay(2000);
        expect(player.y).to.be.greaterThan(startPlayerY);
        oldPlayerY = player.y;
        // Condition
        player.y = startPlayerY;
        KeyEvent.dispatchKeyDown(32);
        expect(keyDown).to.have.been.calledOnce;
        await phaserTester.delay(2000);
        expect(player.y).to.be.greaterThan(oldPlayerY);
        // Cleanup
        KeyEvent.dispatchKeyUp(32);
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
        KeyEvent.dispatchKeyDown(32);
        expect(keyDown).to.have.been.calledOnce;
        await phaserTester.delay(2000);
        expect(player.y).to.be.equal(playerGroundedPos);
        // Condition
        await phaserTester.delay(1000);
        expect(player.y).to.be.equal(playerGroundedPos);
        // Cleanup
        KeyEvent.dispatchKeyUp(32);
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
        await phaserTester.waitForGameEvent('jump');
        expect(playerJumpFunc).to.have.been.calledOnce;
        await phaserTester.delay(1000);
        regularJumpHeight = playerGroundedPos - player.y;
        // Condition
        KeyEvent.dispatchKeyDown(32);
        expect(keyDown).to.have.been.calledOnce;
        await phaserTester.waitForGameEvent('grounded');
        expect(player.y).to.be.equal(playerGroundedPos);
        KeyEvent.dispatchKeyUp(32);
        expect(keyUp).to.have.been.calledOnce;
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
        KeyEvent.dispatchKeyDown(32);
        expect(keyDown).to.have.been.calledOnce;
        await phaserTester.waitForGameEvent('grounded');
        expect(player.y).to.be.equal(playerGroundedPos);
        KeyEvent.dispatchKeyUp(32);
        expect(keyUp).to.have.been.calledOnce;
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
        phaserTester.onTestEnd();
    });

    after(() => {
        phaserTester.deinit();
    });
});
