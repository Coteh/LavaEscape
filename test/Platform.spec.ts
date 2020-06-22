import 'phaser';

import * as chai from 'chai';
import { stub } from 'sinon';
import * as sinonChai from 'sinon-chai';

import { assert, expect } from 'chai';
import { BlockScene } from './scenes/BlockScene';
import PhaserTester from './lib/PhaserTester';
import { Block } from '../src/gameobjects/Block';
import { Player } from '../src/gameobjects/Player';
import KeyEvent from './lib/KeyEvent';

chai.use(sinonChai);

describe('Platform', () => {
    let scene: BlockScene;
    let phaserTester: PhaserTester<BlockScene>;
    let block: Block;
    let playerMock: Player;

    before(async () => {
        phaserTester = new PhaserTester(BlockScene);
        await phaserTester.setup();
        scene = phaserTester.getScene();
    });

    beforeEach(function () {
        phaserTester.startTestCase(this.currentTest.title, (_player) => {
            playerMock = _player;
        });
    });

    describe('Regular', () => {
        it('can allow player to jump when collided from the top', async () => {
            // Setup Block
            block = scene.createBlock('reg', 400, 400);
            // Setup jump stub event
            const jumpStub = stub();
            scene.events.on('jump', jumpStub);
            // Constants
            const playerGroundedPos =
                block.getBounds().top - playerMock.getBounds().height / 2;
            // Position player
            playerMock.x = 400;
            playerMock.y = 200;
            // Wait for jump then a second after it should be in the air still
            await phaserTester.waitForGameEvent('jump');
            await phaserTester.delay(1000);
            // Check condition
            expect(jumpStub).to.be.calledOnce;
            expect(playerMock.y).to.be.lessThan(playerGroundedPos);
        });

        it('should not allow player to jump if collided with from any other side', async () => {
            // Setup Blocks
            block = scene.createBlock('reg', 400, 400);
            scene.createBlock('reg', 200, 200);
            // Constants
            const playerGroundedPos =
                block.getBounds().top - playerMock.getBounds().height / 2;
            // Position player
            playerMock.x = 400;
            playerMock.y = 200;
            // Wait for jump
            await phaserTester.waitForGameEvent('jump');
            // Setup jump stub event
            const jumpStub = stub();
            scene.events.on('jump', jumpStub);
            // Set player to go left
            phaserTester.keyDown = stub().callsFake(function (
                e: KeyboardEvent
            ) {
                expect(e.keyCode).to.equal(37);
            });
            window.addEventListener('keydown', phaserTester.keyDown);
            KeyEvent.dispatchKeyDown(37);
            // Wait half a second
            await phaserTester.delay(500);
            // Precondition: Player is still above the first block
            expect(playerMock.y).to.be.lessThan(playerGroundedPos);
            // Wait 2 seconds for the result
            await phaserTester.delay(2000);
            // Condition: Jump was not called after player went left
            expect(jumpStub).to.not.be.called;
            // Cleanup
            KeyEvent.dispatchKeyUp(37);
        });

        it('should not allow player to jump if player moves past it from the bottom', async () => {
            // Setup Block
            block = scene.createBlock('reg', 400, 400);
            // Constants
            const playerGroundedPos =
                block.getBounds().top - playerMock.getBounds().height / 2;
            // Position player
            playerMock.x = 400;
            playerMock.y = 300;
            // Wait for jump
            await phaserTester.waitForGameEvent('jump');
            // Create new block where player started
            scene.createBlock('reg', 400, 300);
            // Setup jump stub event
            const jumpStub = stub();
            scene.events.on('jump', jumpStub);
            // Wait half a second
            await phaserTester.delay(500);
            // Precondition: Player is still above the first block
            expect(playerMock.y).to.be.lessThan(playerGroundedPos);
            // Wait until player reaches y of 250 or less
            await phaserTester.waitForCondition(() => {
                return playerMock.y <= 250;
            });
            // Condition: Jump was not called after player went below block
            expect(jumpStub).to.not.be.called;
        });
    });

    describe('Moving', () => {
        it('should behave like a regular platform', async () => {
            // Create block
            block = scene.createBlock('moving', 400, 400);
            // Constants
            const playerGroundedPos =
                block.getBounds().top - playerMock.getBounds().height / 2;
            // Setup jump stub
            const jumpStub = stub();
            scene.events.on('jump', jumpStub);
            // Position player
            playerMock.x = 400;
            playerMock.y = 200;
            // Precondition: Player is above platform
            expect(playerMock.y).to.be.lessThan(playerGroundedPos);
            // Wait till jump
            await phaserTester.waitForGameEvent('jump');
            // Condition: Player jumped from moving platform
            expect(jumpStub).to.be.calledOnce;
            // Wait half a second
            await phaserTester.delay(500);
            // Postcondition: Player is still above moving platform
            expect(playerMock.y).to.be.lessThan(playerGroundedPos);
        });

        it('should move horizontally', async () => {
            // Create block
            block = scene.createBlock('moving', 400, 400);
            // Record old block position
            let oldBlockX = block.x;
            let oldBlockY = block.y;
            // Elapse a second of time
            await phaserTester.delay(1000);
            // Condition: Block has exact same y and its x has moved
            expect(block.y).to.be.equal(oldBlockY);
            expect(block.x).to.not.be.equal(oldBlockX);
        });

        it('should have its direction mirrored when hitting game boundary', async () => {
            // Create block
            block = scene.createBlock(
                'moving',
                // TODO fix Block's bounds checking
                // so that it checks for game width instead of hardcoded value
                phaserTester.getGameWidth() - 200,
                400
            );
            // Record old block position
            let oldBlockX = block.x;
            let oldBlockY = block.y;
            // Elapse a second of time
            await phaserTester.delay(1000);
            // Precondition: Block has exact same y and its x has moved to the right
            expect(block.y).to.be.equal(oldBlockY);
            expect(block.x).to.be.greaterThan(oldBlockX);
            // Record x and y
            oldBlockX = block.x;
            oldBlockY = block.y;
            // Elapse another second of time
            await phaserTester.delay(1000);
            // Precondition: Block has exact same y and its x has moved to the left
            expect(block.y).to.be.equal(oldBlockY);
            expect(block.x).to.be.lessThan(oldBlockX);
        });
    });
    // TODO(#30)
    // describe('Collapsable', () => {

    // });

    afterEach(() => {
        phaserTester.endTestCase();
    });

    after(() => {
        phaserTester.deinit();
    });
});
