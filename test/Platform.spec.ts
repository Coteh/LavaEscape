import 'phaser';

import { assert, expect } from 'chai';
import { BlockScene } from './scenes/BlockScene';
import PhaserTester from './lib/PhaserTester';
import { Block } from '../src/gameobjects/Block';
import { Player } from '../src/gameobjects/Player';

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
            assert.fail('Not implemented');
            // TODO blocks don't render, even after adding it to scene graph
            // block = scene.createBlock('reg');
            // await phaserTester.delay(100000);
            // expect(block.y).equal(0);
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
