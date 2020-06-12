import 'phaser';
import PhaserTester from './lib/PhaserTester';
import { LavaScene } from './scenes/LavaScene';
import { assert } from 'chai';

describe('Lava', () => {
    let scene: LavaScene;
    let phaserTester: PhaserTester<LavaScene>;

    before((done) => {
        phaserTester = new PhaserTester(LavaScene, (_scene: LavaScene) => {
            scene = _scene;
            done();
        });
    });

    beforeEach(function () {
        scene.onTestStart(() => {});
        phaserTester.onTestStart(this.currentTest.title);
    });

    it('should move up', () => {
        assert.fail('Not implemented');
    });

    it('should be able to speed up over time', () => {
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
