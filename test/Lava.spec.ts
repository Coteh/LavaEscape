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

    it('should be able to speed up after 10 seconds', async () => {
        let oldLavaY: number = lava.y;
        await phaserTester.delay(1000);
        const oldSpeed: number = Math.abs(lava.y - oldLavaY);
        await phaserTester.delay(10000);
        oldLavaY = lava.y;
        await phaserTester.delay(1000);
        expect(Math.abs(lava.y - oldLavaY)).to.be.greaterThan(oldSpeed);
    }).timeout(15000);

    it('should be able to be slowed down temporarily', async () => {
        let oldLavaY: number = lava.y;
        lava.moveDown(200);
        expect(lava.y).to.be.equal(oldLavaY - lava.y);
    });

    it('should be able to increase speed the further away from player', async () => {
        let oldLavaY: number = lava.y;
        await phaserTester.delay(1000);
        const oldSpeed: number = Math.abs(lava.y - oldLavaY);
        playerMock.y += 2000;
        oldLavaY = lava.y;
        await phaserTester.delay(1000);
        expect(Math.abs(lava.y - oldLavaY)).to.be.greaterThan(oldSpeed);
    });

    it('should slow to a halt when game over', async () => {
        // Get old speed
        let oldLavaY: number = lava.y;
        await phaserTester.delay(1000);
        const oldSpeed: number = Math.abs(lava.y - oldLavaY);
        // Let player "collide" with lava to simulate game over precondition
        playerMock.y = lava.y;
        // Directly trigger lava speed change when game over
        lava.setGameOverSpeed();
        // Get new speed, is it slower?
        oldLavaY = lava.y;
        await phaserTester.delay(1000);
        expect(Math.abs(lava.y - oldLavaY)).to.be.lessThan(oldSpeed);
        // After 5 more seconds, is speed close to 0?
        await phaserTester.delay(5000);
        expect(Math.abs(lava.y - oldLavaY)).to.be.closeTo(0, 0.1);
    });

    afterEach(() => {
        phaserTester.onTestEnd();
    });

    after(() => {
        phaserTester.deinit();
    });
});
