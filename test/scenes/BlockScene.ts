import { Block } from '../../src/gameobjects/Block';
import { RegularBlockComponent } from '../../src/gameobjects/blocks/RegularBlockComponent';
import { Player } from '../../src/gameobjects/Player';

export class BlockScene extends Phaser.Scene {
    private block: Block;
    private playerMock: Player;

    constructor() {
        super({
            key: 'MainScene',
        });
    }

    public createBlock(blockType: string): Block {
        switch (blockType) {
            case 'reg':
                this.block = new Block(
                    this,
                    0,
                    0,
                    100,
                    20,
                    'reg_platform',
                    1,
                    new RegularBlockComponent(this.playerMock),
                    0
                );
                break;
            case 'moving':
                break;
            case 'collapse':
                break;
        }
        this.add.existing(this.block);
        this.block.setPlayerReference(this.playerMock);
        return this.block;
    }

    preload(): void {
        this.load.image('reg_platform', './assets/img/Platform.png');
    }

    create(): void {
        this.scene.launch('DebugScene');
        this.events.emit('debugToggle');
    }

    public onTestStart(testCallback): void {
        // Destroy old objects if any
        this.block?.destroy();
        this.playerMock?.destroy();
        // Setup test stuff
        this.playerMock = new Player(this, 0, -200, new Map());
        // Execute test init callback
        if (testCallback) {
            testCallback(this.playerMock);
        }
    }

    update(time: number, delta: number): void {
        this.block?.update(time, delta);
    }
}
