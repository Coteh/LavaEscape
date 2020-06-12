export default class KeyEvent {
    static dispatchKeyEvent(keyEvent: string, keyCode: any) {
        window.dispatchEvent(
            new KeyboardEvent(keyEvent, {
                // @ts-ignore https://github.com/photonstorm/phaser/issues/2542
                keyCode: keyCode,
            })
        );
    }

    static dispatchKeyDown(keyCode) {
        KeyEvent.dispatchKeyEvent('keydown', keyCode);
    }

    static dispatchKeyUp(keyCode) {
        KeyEvent.dispatchKeyEvent('keyup', keyCode);
    }
}
