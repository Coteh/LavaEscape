export function getManualBounds(gameObject: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Sprite) {
    return new Phaser.Geom.Rectangle(gameObject.x - gameObject.width / 2, gameObject.y - gameObject.height / 2, gameObject.width, gameObject.height);
}
