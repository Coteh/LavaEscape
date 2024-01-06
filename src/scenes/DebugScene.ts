import { DebugManager } from '../managers/DebugManager';

export class DebugScene extends Phaser.Scene {
    private debugManager: DebugManager;

    constructor() {
        super({
            key: 'DebugScene',
        });
    }

    create(): void {
        var mainScene: Phaser.Scene = this.scene.get('MainScene');
        this.debugManager = new DebugManager(this);
        this.debugManager.addKey('xspeed');
        this.debugManager.addKey('yspeed');
        this.debugManager.addKey('playerlava');
        this.debugManager.addKey('lavaSpeed');
        this.debugManager.addKey('lavaWarn');
        this.debugManager.addKey('lavaForgiveness');
        this.debugManager.addKey('lavaSpeedupFactor');
        this.debugManager.addKey('lavaSpeedDivisor');
        this.debugManager.addKey('grounded');
        this.debugManager.addKey('playerX');
        this.debugManager.addKey('playerY');
        this.debugManager.addKey('mana');
        this.debugManager.addKey('highscore');
        mainScene.events.on('debug', (key, value) => {
            this.debugManager.setText(key, value);
        });
        mainScene.events.on('debugToggle', () => {
            this.debugManager.toggleVisibility();
        });
        this.events.on('shutdown', () => {
            mainScene.events.removeAllListeners('debug');
            mainScene.events.removeAllListeners('debugToggle');
        });
    }
}
