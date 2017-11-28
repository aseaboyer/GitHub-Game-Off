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
        maxCount: 1,
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
            name: "start",
            file: "sounds/victory.wav",
            priority: 100
        },
        {
            name: "loss",
            file: "sounds/lose.wav",
            priority: 100
        },
        {
            name: "playerShot",
            file: "sounds/sad.wav",
            priority: 50
        },
        {
            name: "rabbitShot",
            file: "sounds/singleShot.wav",
            priority: 30
        },
        {
            name: "eatRabbit",
            file: "sounds/positive.wav",
            priority: 40
        },
        {
            name: "drinkWhiskey",
            file: "sounds/roar.wav",
            priority: 60
        },
        {
            name: "hunterSpawn",
            file: "sounds/hunterAppear.mp3",
            priority: 20
        },
        {
            name: "rabbitSpawn",
            file: "sounds/rabbitAppear.wav",
            priority: 10
        }
    ],
}