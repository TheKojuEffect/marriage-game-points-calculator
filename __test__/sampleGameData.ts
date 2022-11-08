import {GameData} from "../src/Share";

export const sampleGameData: GameData = {
    "game": {
        "id": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
        "createdAt": new Date("2022-11-08T14:34:52.871Z")
    },
    "settings": {
        "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
        "pointRate": 1,
        "seenPoint": 3,
        "unseenPoint": 10,
        "dubleeWinBonusPoint": 5,
        "foulPoint": 15
    },
    "players": [
        {
            "id": "f4ed920e-0e85-4405-a881-571e62bf79ed",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "index": 0,
            "name": "One"
        },
        {
            "id": "f7bdab0a-88fe-4f93-bca5-a33a616b038d",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "index": 1,
            "name": "Two"
        },
        {
            "id": "265e83ca-3e82-49ac-912c-42cd6de16ce2",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "index": 2,
            "name": "Three"
        },
        {
            "id": "a8f73428-f6c3-4aee-9fcb-acc520f93e54",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "index": 3,
            "name": "Four"
        },
        {
            "id": "9b33235c-4a92-4b00-bfaf-2d75b261711a",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "index": 4,
            "name": "Five"
        },
        {
            "id": "020ced81-7d09-4d9a-9980-946e61154a72",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "index": 5,
            "name": "Six"
        },
        {
            "id": "eea9acc6-8bce-4635-9467-a4bb5b37db07",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "index": 6,
            "name": "Seven"
        }
    ],
    "rounds": [
        {
            "id": "70608607-bde4-4aeb-b3a3-7782b0a53ae1",
            "createdAt": new Date("2022-11-08T14:38:41.935Z"),
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "winnerPlayerId": "eea9acc6-8bce-4635-9467-a4bb5b37db07",
            "dubleeWin": false
        },
        {
            "id": "23f1f70b-6bfe-4348-a6e4-0ee538125e00",
            "createdAt": new Date("2022-11-08T14:38:08.280Z"),
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "winnerPlayerId": "eea9acc6-8bce-4635-9467-a4bb5b37db07",
            "dubleeWin": true
        },
        {
            "id": "11911ae0-9cf8-4d0c-8d78-afefb578fbf7",
            "createdAt": new Date("2022-11-08T14:37:34.217Z"),
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "winnerPlayerId": "f4ed920e-0e85-4405-a881-571e62bf79ed",
            "dubleeWin": false
        },
        {
            "id": "e6f85e13-9ea3-4481-8b6a-ae83bd5a0538",
            "createdAt": new Date("2022-11-08T14:37:18.392Z"),
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "winnerPlayerId": "265e83ca-3e82-49ac-912c-42cd6de16ce2",
            "dubleeWin": false
        },
        {
            "id": "63790233-8762-4b44-bca8-134aada0ceb9",
            "createdAt": new Date("2022-11-08T14:36:19.062Z"),
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "winnerPlayerId": "f7bdab0a-88fe-4f93-bca5-a33a616b038d",
            "dubleeWin": false
        },
        {
            "id": "cc92f6d7-f6e6-49eb-9439-03053cb07c3b",
            "createdAt": new Date("2022-11-08T14:35:40.704Z"),
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "winnerPlayerId": "f4ed920e-0e85-4405-a881-571e62bf79ed",
            "dubleeWin": true
        }
    ],
    "scores": [
        {
            "roundId": "11911ae0-9cf8-4d0c-8d78-afefb578fbf7",
            "playerId": "020ced81-7d09-4d9a-9980-946e61154a72",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 8,
            "status": 1,
            "point": 34
        },
        {
            "roundId": "11911ae0-9cf8-4d0c-8d78-afefb578fbf7",
            "playerId": "265e83ca-3e82-49ac-912c-42cd6de16ce2",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 0,
            "status": 0,
            "point": -21
        },
        {
            "roundId": "11911ae0-9cf8-4d0c-8d78-afefb578fbf7",
            "playerId": "9b33235c-4a92-4b00-bfaf-2d75b261711a",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 0,
            "status": 0,
            "point": -21
        },
        {
            "roundId": "11911ae0-9cf8-4d0c-8d78-afefb578fbf7",
            "playerId": "a8f73428-f6c3-4aee-9fcb-acc520f93e54",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 0,
            "status": 0,
            "point": -21
        },
        {
            "roundId": "11911ae0-9cf8-4d0c-8d78-afefb578fbf7",
            "playerId": "f4ed920e-0e85-4405-a881-571e62bf79ed",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 3,
            "status": 1,
            "point": 50
        },
        {
            "roundId": "11911ae0-9cf8-4d0c-8d78-afefb578fbf7",
            "playerId": "f7bdab0a-88fe-4f93-bca5-a33a616b038d",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 0,
            "status": 0,
            "point": -21
        },
        {
            "roundId": "23f1f70b-6bfe-4348-a6e4-0ee538125e00",
            "playerId": "020ced81-7d09-4d9a-9980-946e61154a72",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 0,
            "status": 0,
            "point": -25
        },
        {
            "roundId": "23f1f70b-6bfe-4348-a6e4-0ee538125e00",
            "playerId": "265e83ca-3e82-49ac-912c-42cd6de16ce2",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 3,
            "status": 1,
            "point": 0
        },
        {
            "roundId": "23f1f70b-6bfe-4348-a6e4-0ee538125e00",
            "playerId": "9b33235c-4a92-4b00-bfaf-2d75b261711a",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 1,
            "status": 1,
            "point": -12
        },
        {
            "roundId": "23f1f70b-6bfe-4348-a6e4-0ee538125e00",
            "playerId": "a8f73428-f6c3-4aee-9fcb-acc520f93e54",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 1,
            "status": 1,
            "point": -12
        },
        {
            "roundId": "23f1f70b-6bfe-4348-a6e4-0ee538125e00",
            "playerId": "eea9acc6-8bce-4635-9467-a4bb5b37db07",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 5,
            "status": 1,
            "point": 74
        },
        {
            "roundId": "23f1f70b-6bfe-4348-a6e4-0ee538125e00",
            "playerId": "f4ed920e-0e85-4405-a881-571e62bf79ed",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 0,
            "status": 0,
            "point": -25
        },
        {
            "roundId": "23f1f70b-6bfe-4348-a6e4-0ee538125e00",
            "playerId": "f7bdab0a-88fe-4f93-bca5-a33a616b038d",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 0,
            "status": 3,
            "point": 0
        },
        {
            "roundId": "63790233-8762-4b44-bca8-134aada0ceb9",
            "playerId": "020ced81-7d09-4d9a-9980-946e61154a72",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 10,
            "status": 1,
            "point": 34
        },
        {
            "roundId": "63790233-8762-4b44-bca8-134aada0ceb9",
            "playerId": "265e83ca-3e82-49ac-912c-42cd6de16ce2",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 1,
            "status": 1,
            "point": -20
        },
        {
            "roundId": "63790233-8762-4b44-bca8-134aada0ceb9",
            "playerId": "9b33235c-4a92-4b00-bfaf-2d75b261711a",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 3,
            "status": 1,
            "point": -8
        },
        {
            "roundId": "63790233-8762-4b44-bca8-134aada0ceb9",
            "playerId": "a8f73428-f6c3-4aee-9fcb-acc520f93e54",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 2,
            "status": 1,
            "point": -14
        },
        {
            "roundId": "63790233-8762-4b44-bca8-134aada0ceb9",
            "playerId": "f4ed920e-0e85-4405-a881-571e62bf79ed",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 3,
            "status": 1,
            "point": -8
        },
        {
            "roundId": "63790233-8762-4b44-bca8-134aada0ceb9",
            "playerId": "f7bdab0a-88fe-4f93-bca5-a33a616b038d",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 4,
            "status": 1,
            "point": 16
        },
        {
            "roundId": "70608607-bde4-4aeb-b3a3-7782b0a53ae1",
            "playerId": "020ced81-7d09-4d9a-9980-946e61154a72",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 0,
            "status": 3,
            "point": 0
        },
        {
            "roundId": "70608607-bde4-4aeb-b3a3-7782b0a53ae1",
            "playerId": "265e83ca-3e82-49ac-912c-42cd6de16ce2",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 0,
            "status": 3,
            "point": 0
        },
        {
            "roundId": "70608607-bde4-4aeb-b3a3-7782b0a53ae1",
            "playerId": "9b33235c-4a92-4b00-bfaf-2d75b261711a",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 0,
            "status": 0,
            "point": -15
        },
        {
            "roundId": "70608607-bde4-4aeb-b3a3-7782b0a53ae1",
            "playerId": "a8f73428-f6c3-4aee-9fcb-acc520f93e54",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 2,
            "status": 1,
            "point": -2
        },
        {
            "roundId": "70608607-bde4-4aeb-b3a3-7782b0a53ae1",
            "playerId": "eea9acc6-8bce-4635-9467-a4bb5b37db07",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 3,
            "status": 1,
            "point": 17
        },
        {
            "roundId": "70608607-bde4-4aeb-b3a3-7782b0a53ae1",
            "playerId": "f4ed920e-0e85-4405-a881-571e62bf79ed",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 0,
            "status": 3,
            "point": 0
        },
        {
            "roundId": "70608607-bde4-4aeb-b3a3-7782b0a53ae1",
            "playerId": "f7bdab0a-88fe-4f93-bca5-a33a616b038d",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 0,
            "status": 3,
            "point": 0
        },
        {
            "roundId": "cc92f6d7-f6e6-49eb-9439-03053cb07c3b",
            "playerId": "020ced81-7d09-4d9a-9980-946e61154a72",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 0,
            "status": 3,
            "point": 0
        },
        {
            "roundId": "cc92f6d7-f6e6-49eb-9439-03053cb07c3b",
            "playerId": "265e83ca-3e82-49ac-912c-42cd6de16ce2",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 3,
            "status": 1,
            "point": -8
        },
        {
            "roundId": "cc92f6d7-f6e6-49eb-9439-03053cb07c3b",
            "playerId": "9b33235c-4a92-4b00-bfaf-2d75b261711a",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 5,
            "status": 1,
            "point": 2
        },
        {
            "roundId": "cc92f6d7-f6e6-49eb-9439-03053cb07c3b",
            "playerId": "a8f73428-f6c3-4aee-9fcb-acc520f93e54",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 4,
            "status": 1,
            "point": -3
        },
        {
            "roundId": "cc92f6d7-f6e6-49eb-9439-03053cb07c3b",
            "playerId": "f4ed920e-0e85-4405-a881-571e62bf79ed",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 1,
            "status": 1,
            "point": 22
        },
        {
            "roundId": "cc92f6d7-f6e6-49eb-9439-03053cb07c3b",
            "playerId": "f7bdab0a-88fe-4f93-bca5-a33a616b038d",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 2,
            "status": 1,
            "point": -13
        },
        {
            "roundId": "e6f85e13-9ea3-4481-8b6a-ae83bd5a0538",
            "playerId": "020ced81-7d09-4d9a-9980-946e61154a72",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 2,
            "status": 1,
            "point": 2
        },
        {
            "roundId": "e6f85e13-9ea3-4481-8b6a-ae83bd5a0538",
            "playerId": "265e83ca-3e82-49ac-912c-42cd6de16ce2",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 3,
            "status": 1,
            "point": 37
        },
        {
            "roundId": "e6f85e13-9ea3-4481-8b6a-ae83bd5a0538",
            "playerId": "9b33235c-4a92-4b00-bfaf-2d75b261711a",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 0,
            "status": 0,
            "point": -17
        },
        {
            "roundId": "e6f85e13-9ea3-4481-8b6a-ae83bd5a0538",
            "playerId": "a8f73428-f6c3-4aee-9fcb-acc520f93e54",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 2,
            "status": 1,
            "point": 2
        },
        {
            "roundId": "e6f85e13-9ea3-4481-8b6a-ae83bd5a0538",
            "playerId": "f4ed920e-0e85-4405-a881-571e62bf79ed",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 0,
            "status": 2,
            "point": -7
        },
        {
            "roundId": "e6f85e13-9ea3-4481-8b6a-ae83bd5a0538",
            "playerId": "f7bdab0a-88fe-4f93-bca5-a33a616b038d",
            "gameId": "a18448d1-96f0-4b96-9e1c-23d1872ac199",
            "maal": 0,
            "status": 0,
            "point": -17
        }
    ]
};

export const sampleWithOnlyPlayers: GameData =
    {
        "game": {
            "id": "429bd0f1-4c97-4370-a05b-57d879a25db8",
            "createdAt": new Date("2022-11-08T18:16:19.978Z"),
        },
        "settings": {
            "gameId": "429bd0f1-4c97-4370-a05b-57d879a25db8",
            "pointRate": 0.15,
            "seenPoint": 3,
            "unseenPoint": 10,
            "dubleeWinBonusPoint": 5,
            "foulPoint": 15
        },
        "players": [
            {
                "id": "0ee36618-7015-4cc2-9298-24a6df712d07",
                "gameId": "429bd0f1-4c97-4370-a05b-57d879a25db8",
                "index": 0,
                "name": "Ram"
            },
            {
                "id": "8bcd48a4-67e5-457c-9052-8f7695b67743",
                "gameId": "429bd0f1-4c97-4370-a05b-57d879a25db8",
                "index": 1,
                "name": "Shyam"
            }
        ],
        "rounds": [],
        "scores": []
    };