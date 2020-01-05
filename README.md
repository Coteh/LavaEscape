# Lava Escape

A jump game made using Phaser 3 and TypeScript.

## Features
- Basic jump game mechanics
- Hold down space bar to hold jump and increase jump height
- Procedural chunks of platforms are generated for the player to jump on
    - 3 different types of chunks provide different types and configurations of platforms
- Speed of lava wraps to speed of player
- Lava dial item pickups decrease the lava height and temporarily slow it down
- High score
- Vertical scrolling background that loops back to bottom

## Limitations
- No background music at the moment due to (self-imposed) time constraints
- No high score table at the moment either
- Not everything in the codebase has been modularized yet (e.g. cooldowns)

## Future Additions
- Reintroduce the broken platform type
- Give player ability to wrap around stage
- Add background music
- Add high score table
- Revamp chunking system to provide more variety of platforms

## Credits
- TypeScript and Phaser 3 build configuration based off of digitsensitive's Phaser 3 TypeScript examples ([link](https://github.com/digitsensitive/phaser3-typescript))
- Game background by ferdinand feng on Unsplash ([link](https://unsplash.com/photos/2RAt2zMoHqU))
- Font used is "Press Start" font from dafont ([link](https://www.dafont.com/press-start.font))
