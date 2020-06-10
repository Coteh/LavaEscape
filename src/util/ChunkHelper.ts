export namespace ChunkHelper {
    export function randomOffset(): number {
        return Math.random() * 600 + 150;
    }

    export function randomSpeed(): number {
        var sign: number = Math.round(Math.random()) ? 1 : -1;
        return sign * Math.random() * 1 + 0.25;
    }
}
