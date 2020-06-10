import { Enemy } from '../gameobjects/Enemy';
import { Scene } from 'phaser';
import { Player } from '../gameobjects/Player';

export class EnemyManager {
    private scene: Scene;
    private player: Player;

    constructor(scene: Scene, player: Player) {
        this.scene = scene;
        this.player = player;
    }

    randomSpeed() {
        return Math.random() * 0.3 + 0.25;
    }

    spawnEnemy(): Enemy {
        var enemy = new Enemy(
            this.scene,
            this.player.x,
            this.player.y - 1000,
            100,
            100,
            this.randomSpeed()
        );
        this.scene.add.existing(enemy);
        return enemy;
    }
}
