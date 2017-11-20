var gameData = {
    bear: {
        startPosition: {
            x: 3,
            y: 2
        }
    },
    rabbits: {
        frequency: 8,
        maxCount: 2,
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
        maxCount: 2
    },
    whiskey: {
        frequency: 10
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
    ]
}