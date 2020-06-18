import 'phaser';

import * as chai from 'chai';
import { stub } from 'sinon';
import * as sinonChai from 'sinon-chai';

import { assert, expect } from 'chai';
import { BlockScene } from './scenes/BlockScene';
import PhaserTester from './lib/PhaserTester';
import { Block } from '../src/gameobjects/Block';
import { Player } from '../src/gameobjects/Player';

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
            const jumpStub = stub();
            // Setup jump stub event
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

        it('should not allow player to jump if collided with from any other side', () => {
            assert.fail('Not implemented');
        });

        it('should not allow player to jump if player moves past it from the bottom', () => {
            assert.fail('Not implemented');
        });
    });

    describe('Moving', () => {
        it('should behave like a regular platform', () => {
            assert.fail('Not implemented');
        });

        it('should move horizontally', () => {
            assert.fail('Not implemented');
        });

        it('should have its direction mirrored when hitting game boundary', () => {
            assert.fail('Not implemented');
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
