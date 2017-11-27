var gameData = {
    bear: {
        startPosition: {
            x: 3,
            y: 2
        },
        startingHealth: 3
    },
    rabbits: {
        frequency: 8,
        maxCount: 2,
        chanceToMove: 0.5,
        startPositions: [
            {
                x: 0,
                y: 0
            },
            {
                x: 0,
                y: 6
            },
            {
                x: 5,
                y: 0
            },
            {
                x: 5,
                y: 6
            }
        ]
    },
    hunters: {
        frequency: 15,
        maxCount: 1
    },
    whiskey: {
        frequency: 25
    },
    points: [
        {
            type: "rabbit",
            value: 10
        },
        {
            type: "hunter",
            value: 100
        }
    ],
    sounds: [
        {
            type: "rabbit",
            file: "rabbit.wave",
            priority: 1
        }
    ],
}