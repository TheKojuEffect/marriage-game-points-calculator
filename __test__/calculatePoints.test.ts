import {calculatePoints, PlayerPoints, PlayerStatus} from "../src/calculatePoints";
import {PlayerRoundStatus, Round} from "../src/Scores";
import {defaultGameSettings, GameSettings} from "../src/Settings";

describe('calculatePoints', () => {

    describe('With default settings', () => {
        type Scenario = { round: Round, points: PlayerPoints };

        const scenarios: Scenario[] = [
            {
                round: {
                    winnerPlayerId: "player1Id",
                    dubleeWin: false,
                    scores: [
                        {playerId: "player1Id", maal: 1, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 0, status: PlayerRoundStatus.SEEN},
                    ],
                },
                points: {
                    player1Id: 4,
                    player2Id: -4,
                },
            },

            {
                round: {
                    winnerPlayerId: "player1Id",
                    dubleeWin: false,
                    scores: [
                        {playerId: "player1Id", maal: 1, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 5, status: PlayerRoundStatus.SEEN},
                    ],
                },
                points: {
                    player1Id: -1,
                    player2Id: 1,
                },
            },

            {
                round: {
                    winnerPlayerId: "player2Id",
                    dubleeWin: false,
                    scores: [
                        {playerId: "player1Id", maal: 1, status: PlayerRoundStatus.UNSEEN},
                        {playerId: "player2Id", maal: 5, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 5, status: PlayerRoundStatus.SEEN},
                    ],
                },
                points: {
                    player1Id: -21,
                    player2Id: 20,
                    player3Id: 1,
                },
            },

            {
                round: {
                    winnerPlayerId: "player2Id",
                    dubleeWin: false,
                    scores: [
                        {playerId: "player1Id", maal: 0, status: PlayerRoundStatus.UNSEEN},
                        {playerId: "player2Id", maal: 0, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 0, status: PlayerRoundStatus.UNSEEN},
                    ],
                },
                points: {
                    player1Id: -10,
                    player2Id: 20,
                    player3Id: -10,
                },
            },

            {
                round: {
                    winnerPlayerId: "player2Id",
                    dubleeWin: false,
                    scores: [
                        {playerId: "player1Id", maal: 5, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 6, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 0, status: PlayerRoundStatus.PAUSE},
                    ],
                },
                points: {
                    player1Id: -4,
                    player2Id: 4,
                    player3Id: 0,
                },
            },

            {
                round: {
                    winnerPlayerId: "player3Id",
                    dubleeWin: false,
                    scores: [
                        {playerId: "player1Id", maal: 5, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 6, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 0, status: PlayerRoundStatus.SEEN},
                        {playerId: "player4Id", maal: 10, status: PlayerRoundStatus.SEEN},
                    ],
                },
                points: {
                    player1Id: -4,
                    player2Id: 0,
                    player3Id: -12,
                    player4Id: 16,
                },
            },

            {
                round: {
                    winnerPlayerId: "player3Id",
                    dubleeWin: true,
                    scores: [
                        {playerId: "player1Id", maal: 5, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 6, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 0, status: PlayerRoundStatus.SEEN},
                        {playerId: "player4Id", maal: 10, status: PlayerRoundStatus.SEEN},
                    ],
                },
                points: {
                    player1Id: -9,
                    player2Id: -5,
                    player3Id: 3,
                    player4Id: 11,
                },
            },

            {
                round: {
                    winnerPlayerId: "player5Id",
                    dubleeWin: false,
                    scores: [
                        {playerId: "player1Id", maal: 0, status: PlayerRoundStatus.UNSEEN},
                        {playerId: "player2Id", maal: 2, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 3, status: PlayerRoundStatus.SEEN},
                        {playerId: "player4Id", maal: 4, status: PlayerRoundStatus.SEEN},
                        {playerId: "player5Id", maal: 5, status: PlayerRoundStatus.SEEN},
                    ],
                },
                points: {
                    player1Id: -24,
                    player2Id: -7,
                    player3Id: -2,
                    player4Id: 3,
                    player5Id: 30,
                },
            },

            {
                round: {
                    winnerPlayerId: "player5Id",
                    dubleeWin: true,
                    scores: [
                        {playerId: "player1Id", maal: 0, status: PlayerRoundStatus.UNSEEN},
                        {playerId: "player2Id", maal: 2, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 3, status: PlayerRoundStatus.SEEN},
                        {playerId: "player4Id", maal: 4, status: PlayerRoundStatus.SEEN},
                        {playerId: "player5Id", maal: 5, status: PlayerRoundStatus.SEEN},
                    ],
                },
                points: {
                    player1Id: -29,
                    player2Id: -12,
                    player3Id: -7,
                    player4Id: -2,
                    player5Id: 50,
                },
            },

            {
                round: {
                    winnerPlayerId: "player1Id",
                    dubleeWin: false,
                    scores: [
                        {playerId: "player1Id", maal: 10, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 0, status: PlayerRoundStatus.FOUL},
                    ],
                },
                points: {
                    player1Id: 10,
                    player2Id: -10,
                },
            },

            {
                round: {
                    winnerPlayerId: "player1Id",
                    dubleeWin: true,
                    scores: [
                        {playerId: "player1Id", maal: 5, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 2, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 0, status: PlayerRoundStatus.FOUL},
                        {playerId: "player4Id", maal: 0, status: PlayerRoundStatus.UNSEEN},
                        {playerId: "player5Id", maal: 0, status: PlayerRoundStatus.FOUL},
                    ],
                },
                points: {
                    player1Id: 51,
                    player2Id: -5,
                    player3Id: -12,
                    player4Id: -22,
                    player5Id: -12,
                },
            },
        ];

        scenarios.forEach(({round, points}, index) =>
            it(`should calculate scores with default settings for scenario #${index}`, () => {
                const calculatedScores = calculatePoints(round, defaultGameSettings, {});
                expect(calculatedScores).toEqual(expect.objectContaining(points));
            })
        );
    });

    describe('With Custom Settings', () => {
        type Scenario = { round: Round, settings: GameSettings, points: PlayerPoints };

        const scenarios: Scenario[] = [
            {
                round: {
                    winnerPlayerId: "player1Id",
                    dubleeWin: false,
                    scores: [
                        {playerId: "player1Id", maal: 1, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 2, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 0, status: PlayerRoundStatus.UNSEEN},
                        {playerId: "player4Id", maal: 0, status: PlayerRoundStatus.FOUL},
                    ],
                },
                settings: {
                    ...defaultGameSettings,
                    seenPoint: 5,
                    unseenPoint: 12,
                    foulPoint: 20,

                },
                points: {
                    player1Id: 18,
                    player2Id: 0,
                    player3Id: -15,
                    player4Id: -3,
                },
            },

            {
                round: {
                    winnerPlayerId: "player2Id",
                    dubleeWin: true,
                    scores: [
                        {playerId: "player1Id", maal: 1, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 2, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 0, status: PlayerRoundStatus.UNSEEN},
                        {playerId: "player4Id", maal: 0, status: PlayerRoundStatus.FOUL},
                        {playerId: "player5Id", maal: 0, status: PlayerRoundStatus.PAUSE},
                    ],
                },
                settings: {
                    ...defaultGameSettings,
                    seenPoint: 2,
                    unseenPoint: 7,
                    foulPoint: 12,
                    dubleeWinBonusPoint: 8,
                },
                points: {
                    player1Id: -9,
                    player2Id: 38,
                    player3Id: -18,
                    player4Id: -11,
                    player5Id: 0,
                },
            },
        ];

        scenarios.forEach(({round, settings, points}, index) =>
            it(`should calculate scores with custom settings for Scenario #${index}`, () => {
                const calculatedScores = calculatePoints(round, settings, {});
                expect(calculatedScores).toEqual(expect.objectContaining(points));
            })
        );
    });

    describe('With nextRoundPointAdjustment', () => {
        type Scenario = { round: Round, prevRoundPlayerStatus: PlayerStatus, points: PlayerPoints };

        const scenarios: Scenario[] = [
            {
                round: {
                    winnerPlayerId: "player1Id",
                    dubleeWin: false,
                    scores: [
                        {playerId: "player1Id", maal: 1, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 2, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 0, status: PlayerRoundStatus.UNSEEN},
                        {playerId: "player4Id", maal: 0, status: PlayerRoundStatus.FOUL},
                    ],
                },
                prevRoundPlayerStatus: {
                    player1Id: PlayerRoundStatus.SEEN,
                    player2Id: PlayerRoundStatus.SEEN,
                    player3Id: PlayerRoundStatus.FOUL,
                    player4Id: PlayerRoundStatus.FOUL,
                },
                points: {
                    player1Id: 44,
                    player2Id: 2,
                    player3Id: -28,
                    player4Id: -18,
                },
            },

            {
                round: {
                    winnerPlayerId: "player4Id",
                    dubleeWin: false,
                    scores: [
                        {playerId: "player1Id", maal: 1, status: PlayerRoundStatus.SEEN},
                        {playerId: "player4Id", maal: 6, status: PlayerRoundStatus.SEEN},
                    ],
                },
                prevRoundPlayerStatus: {
                    player1Id: PlayerRoundStatus.SEEN,
                    player4Id: PlayerRoundStatus.FOUL,
                },
                points: {
                    player1Id: -8,
                    player4Id: 8,
                },
            },
            {
                round: {
                    winnerPlayerId: "player1Id",
                    dubleeWin: false,
                    scores: [
                        {playerId: "player1Id", maal: 1, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 0, status: PlayerRoundStatus.SEEN},
                        {playerId: "player4Id", maal: 0, status: PlayerRoundStatus.PAUSE},
                    ],
                },
                prevRoundPlayerStatus: {
                    player1Id: PlayerRoundStatus.SEEN,
                    player2Id: PlayerRoundStatus.SEEN,
                    player4Id: PlayerRoundStatus.FOUL,
                },
                points: {
                    player1Id: 19,
                    player2Id: -4,
                    player4Id: -15,
                },
            },
        ];

        scenarios.forEach(({round, points, prevRoundPlayerStatus}, index) =>
            it(`should calculate scores with prev round for Scenario #${index}`, () => {
                const calculatedScores = calculatePoints(round, defaultGameSettings, prevRoundPlayerStatus);
                expect(calculatedScores).toEqual(expect.objectContaining(points));
            })
        );
    });
})