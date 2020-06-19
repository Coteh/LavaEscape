import { Block } from '../../src/gameobjects/Block';
import { RegularBlockComponent } from '../../src/gameobjects/blocks/RegularBlockComponent';
import { Player } from '../../src/gameobjects/Player';
import { CollideFuncs } from '../../src/util/CollideFuncs';

export class BlockScene extends Phaser.Scene {
    private blocks: Block[];
    private playerMock: Player;

    private keys: Map<string, Phaser.Input.Keyboard.Key>;

    constructor() {
        super({
            key: 'MainScene',
        });
        this.blocks = [];
    }

    public createBlock(blockType: string, x: number, y: number): Block {
        let block: Block;
        switch (blockType) {
            case 'reg':
                block = new Block(
                    this,
                    x,
                    y,
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
        this.blocks.push(block);
        this.add.existing(block);
        block.setPlayerReference(this.playerMock);
        block.setPlayerCollideFunc(CollideFuncs.resolvePlayerBlockCollision);
        return block;
    }

    preload(): void {
        this.load.image('reg_platform', './assets/img/Platform.png');
        this.keys = new Map([
            ['LEFT', this.input.keyboard.addKey('LEFT')],
            ['RIGHT', this.input.keyboard.addKey('RIGHT')],
            ['SPACE', this.input.keyboard.addKey('SPACE')],
        ]);
    }

    create(): void {
        this.scene.launch('DebugScene');
        this.events.emit('debugToggle');
    }

    public onTestStart(testCallback): void {
        // Destroy old objects if any
        this.blocks.forEach((block) => {
            block.destroy();
        });
        this.blocks = [];
        this.playerMock?.destroy();
        // Setup test stuff
        this.playerMock = new Player(this, 0, -200, this.keys);
        // Execute test init callback
        if (testCallback) {
            testCallback(this.playerMock);
        }
    }

    update(time: number, delta: number): void {
        this.blocks.forEach((block) => {
            block.update(time, delta);
        });
        this.playerMock?.update(time, delta);
    }
}
