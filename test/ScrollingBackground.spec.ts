import 'phaser';
import { assert, expect } from 'chai';
import PhaserTester from './lib/PhaserTester';
import { BackgroundScene } from './scenes/BackgroundScene';
import { Player } from '../src/gameobjects/Player';
import { ScrollingBackground } from '../src/gameobjects/ScrollingBackground';

describe('ScrollingBackground', () => {
    let scene: BackgroundScene;
    let background: ScrollingBackground;
    let playerMock: Player;
    let phaserTester: PhaserTester<BackgroundScene>;

    before(async () => {
        phaserTester = new PhaserTester(BackgroundScene);
        await phaserTester.setup();
        scene = phaserTester.getScene();
    });

    beforeEach(function () {
        scene.onTestStart((_background, _player) => {
            background = _background;
            playerMock = _player;
        });
        phaserTester.onTestStart(this.currentTest.title);
    });

    it('should scroll down as player moves up', async () => {
        // Take a bit for background to calibrate
        await phaserTester.delay(500);
        // Get old background position for comparison
        let oldBackgroundY: number = background.getActiveBackgroundY();
        // Move player a bit
        playerMock.y -= 200; // using implementation's slowness factor, it can be calculated that this will move bg down by 2 units
        // Wait a bit so bg can update
        await phaserTester.delay(1000);
        // Condition: Background moved down in response to player moving up
        expect(background.getActiveBackgroundY()).to.be.greaterThan(
            oldBackgroundY
        );
    });
    it('should load a new tile if it scrolled down past threshold', async () => {
        // Take a bit for background to calibrate
        await phaserTester.delay(500);
        // Move player upwards enough to spawn new tile
        playerMock.y -= 200 * 300; // move bg down by 600 units, when background y is greater than -10, new bg should be made
        // Wait a bit so bg can update
        await phaserTester.delay(1000);
        // Condition: Background spawned a new tile (there should be 2 instead of 1 now)
        expect(background.getNumberOfBackgroundTiles()).to.be.equal(2);
    });
    it('should delete old background tiles when they are out of view', async () => {
        // Take a bit for background to calibrate
        await phaserTester.delay(500);
        // Move player upwards enough to spawn new tile
        playerMock.y -= 200 * 300; // move bg down by 600 units, when background y is greater than -10, new bg should be made
        // Wait a bit so bg can update
        await phaserTester.delay(1000);
        // Move player a bit more so that old tile can be removed
        playerMock.y -= 200 * 150;
        // Wait a bit so bg can update
        await phaserTester.delay(1000);
        // Condition: Should only be one background tile now, since old tile was deleted due to passing threshold
        expect(background.getNumberOfBackgroundTiles()).to.be.equal(1);
    });

    afterEach(() => {
        phaserTester.onTestEnd();
    });

    after(() => {
        phaserTester.deinit();
    });
});
