export namespace CollideFuncs {
    export function hitTop(
        playerBounds: Phaser.Geom.Rectangle,
        otherBounds: Phaser.Geom.Rectangle
    ): boolean {
        return (
            playerBounds.centerY + playerBounds.height / 2 >=
                otherBounds.centerY - otherBounds.height / 2 &&
            playerBounds.centerX + playerBounds.width / 2 >=
                otherBounds.centerX - otherBounds.width / 2 &&
            playerBounds.centerX - playerBounds.width / 2 <=
                otherBounds.centerX + otherBounds.width / 2 &&
            playerBounds.centerY - playerBounds.height / 2 <=
                otherBounds.centerY + otherBounds.height / 2
        );
    }

    export function hitBounds(
        playerBounds: Phaser.Geom.Rectangle,
        otherBounds: Phaser.Geom.Rectangle
    ): boolean {
        return (
            playerBounds.x > otherBounds.x - otherBounds.width / 2 &&
            playerBounds.x < otherBounds.x + otherBounds.width / 2 &&
            playerBounds.y > otherBounds.y - otherBounds.width / 2 &&
            playerBounds.y < otherBounds.y + otherBounds.width / 2
        );
    }
}
