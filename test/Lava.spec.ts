import 'phaser';
import PhaserTester from './lib/PhaserTester';
import { LavaScene } from './scenes/LavaScene';
import { assert, expect } from 'chai';
import { Lava } from '../src/gameobjects/Lava';
import { Player } from '../src/gameobjects/Player';

describe('Lava', () => {
    let scene: LavaScene;
    let lava: Lava;
    let playerMock: Player;
    let phaserTester: PhaserTester<LavaScene>;

    before(async () => {
        phaserTester = new PhaserTester(LavaScene);
        await phaserTester.setup();
        scene = phaserTester.getScene();
    });

    beforeEach(function () {
        scene.onTestStart((_lava, _player) => {
            lava = _lava;
            playerMock = _player;
        });
        phaserTester.onTestStart(this.currentTest.title);
    });

    it('should move up', async () => {
        const oldLavaY: number = lava.y;
        await phaserTester.delay(1000);
        expect(lava.y).to.be.lessThan(oldLavaY);
    });

    it('should be able to speed up after 10 seconds', () => {
        assert.fail('Not implemented');
    });

    it('should be able to be slowed down temporarily', () => {
        assert.fail('Not implemented');
    });

    it('should be able to increase speed the further away from player', () => {
        assert.fail('Not implemented');
    });

    after(() => {
        phaserTester.deinit();
    });
});
