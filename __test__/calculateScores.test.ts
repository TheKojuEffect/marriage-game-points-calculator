import {calculateScores, Score} from "../src/calculateScores";
import {PlayerRoundStatus, Round} from "../src/Results";
import {defaultGameSettings, GameSettings} from "../src/Settings";

describe('calculateScores', () => {

    describe('With default settings', () => {
        type Scenario = { round: Round, scores: Score[] };

        const scenarios: Scenario[] = [
            {
                round: {
                    winnerPlayerId: "player1Id",
                    dubleeWin: false,
                    results: [
                        {playerId: "player1Id", maal: 1, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 0, status: PlayerRoundStatus.SEEN},
                    ],
                },
                scores: [
                    {playerId: "player1Id", point: 4, nextRoundPointAdjustment: 0},
                    {playerId: "player2Id", point: -4, nextRoundPointAdjustment: 0},
                ]
            },

            {
                round: {
                    winnerPlayerId: "player1Id",
                    dubleeWin: false,
                    results: [
                        {playerId: "player1Id", maal: 1, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 5, status: PlayerRoundStatus.SEEN},
                    ],
                },
                scores: [
                    {playerId: "player1Id", point: -1, nextRoundPointAdjustment: 0},
                    {playerId: "player2Id", point: 1, nextRoundPointAdjustment: 0},
                ]
            },

            {
                round: {
                    winnerPlayerId: "player2Id",
                    dubleeWin: false,
                    results: [
                        {playerId: "player1Id", maal: 1, status: PlayerRoundStatus.UNSEEN},
                        {playerId: "player2Id", maal: 5, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 5, status: PlayerRoundStatus.SEEN},
                    ],
                },
                scores: [
                    {playerId: "player1Id", point: -21, nextRoundPointAdjustment: 0},
                    {playerId: "player2Id", point: 20, nextRoundPointAdjustment: 0},
                    {playerId: "player3Id", point: 1, nextRoundPointAdjustment: 0},
                ]
            },

            {
                round: {
                    winnerPlayerId: "player2Id",
                    dubleeWin: false,
                    results: [
                        {playerId: "player1Id", maal: 0, status: PlayerRoundStatus.UNSEEN},
                        {playerId: "player2Id", maal: 0, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 0, status: PlayerRoundStatus.UNSEEN},
                    ],
                },
                scores: [
                    {playerId: "player1Id", point: -10, nextRoundPointAdjustment: 0},
                    {playerId: "player2Id", point: 20, nextRoundPointAdjustment: 0},
                    {playerId: "player3Id", point: -10, nextRoundPointAdjustment: 0},
                ]
            },

            {
                round: {
                    winnerPlayerId: "player2Id",
                    dubleeWin: false,
                    results: [
                        {playerId: "player1Id", maal: 5, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 6, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 0, status: PlayerRoundStatus.PAUSE},
                    ],
                },
                scores: [
                    {playerId: "player1Id", point: -4, nextRoundPointAdjustment: 0},
                    {playerId: "player2Id", point: 4, nextRoundPointAdjustment: 0},
                    {playerId: "player3Id", point: 0, nextRoundPointAdjustment: 0},
                ]
            },

            {
                round: {
                    winnerPlayerId: "player3Id",
                    dubleeWin: false,
                    results: [
                        {playerId: "player1Id", maal: 5, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 6, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 0, status: PlayerRoundStatus.SEEN},
                        {playerId: "player4Id", maal: 10, status: PlayerRoundStatus.SEEN},
                    ],
                },
                scores: [
                    {playerId: "player1Id", point: -4, nextRoundPointAdjustment: 0},
                    {playerId: "player2Id", point: 0, nextRoundPointAdjustment: 0},
                    {playerId: "player3Id", point: -12, nextRoundPointAdjustment: 0},
                    {playerId: "player4Id", point: 16, nextRoundPointAdjustment: 0},
                ]
            },

            {
                round: {
                    winnerPlayerId: "player3Id",
                    dubleeWin: true,
                    results: [
                        {playerId: "player1Id", maal: 5, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 6, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 0, status: PlayerRoundStatus.SEEN},
                        {playerId: "player4Id", maal: 10, status: PlayerRoundStatus.SEEN},
                    ],
                },
                scores: [
                    {playerId: "player1Id", point: -9, nextRoundPointAdjustment: 0},
                    {playerId: "player2Id", point: -5, nextRoundPointAdjustment: 0},
                    {playerId: "player3Id", point: 3, nextRoundPointAdjustment: 0},
                    {playerId: "player4Id", point: 11, nextRoundPointAdjustment: 0},
                ]
            },

            {
                round: {
                    winnerPlayerId: "player5Id",
                    dubleeWin: false,
                    results: [
                        {playerId: "player1Id", maal: 0, status: PlayerRoundStatus.UNSEEN},
                        {playerId: "player2Id", maal: 2, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 3, status: PlayerRoundStatus.SEEN},
                        {playerId: "player4Id", maal: 4, status: PlayerRoundStatus.SEEN},
                        {playerId: "player5Id", maal: 5, status: PlayerRoundStatus.SEEN},
                    ],
                },
                scores: [
                    {playerId: "player1Id", point: -24, nextRoundPointAdjustment: 0},
                    {playerId: "player2Id", point: -7, nextRoundPointAdjustment: 0},
                    {playerId: "player3Id", point: -2, nextRoundPointAdjustment: 0},
                    {playerId: "player4Id", point: 3, nextRoundPointAdjustment: 0},
                    {playerId: "player5Id", point: 30, nextRoundPointAdjustment: 0},
                ]
            },

            {
                round: {
                    winnerPlayerId: "player5Id",
                    dubleeWin: true,
                    results: [
                        {playerId: "player1Id", maal: 0, status: PlayerRoundStatus.UNSEEN},
                        {playerId: "player2Id", maal: 2, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 3, status: PlayerRoundStatus.SEEN},
                        {playerId: "player4Id", maal: 4, status: PlayerRoundStatus.SEEN},
                        {playerId: "player5Id", maal: 5, status: PlayerRoundStatus.SEEN},
                    ],
                },
                scores: [
                    {playerId: "player1Id", point: -29, nextRoundPointAdjustment: 0},
                    {playerId: "player2Id", point: -12, nextRoundPointAdjustment: 0},
                    {playerId: "player3Id", point: -7, nextRoundPointAdjustment: 0},
                    {playerId: "player4Id", point: -2, nextRoundPointAdjustment: 0},
                    {playerId: "player5Id", point: 50, nextRoundPointAdjustment: 0},
                ]
            },

            {
                round: {
                    winnerPlayerId: "player1Id",
                    dubleeWin: false,
                    results: [
                        {playerId: "player1Id", maal: 10, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 0, status: PlayerRoundStatus.FOUL},
                    ],
                },
                scores: [
                    {playerId: "player1Id", point: 10, nextRoundPointAdjustment: 0},
                    {playerId: "player2Id", point: -10, nextRoundPointAdjustment: -15},
                ]
            },

            {
                round: {
                    winnerPlayerId: "player1Id",
                    dubleeWin: true,
                    results: [
                        {playerId: "player1Id", maal: 5, status: PlayerRoundStatus.SEEN},
                        {playerId: "player2Id", maal: 2, status: PlayerRoundStatus.SEEN},
                        {playerId: "player3Id", maal: 0, status: PlayerRoundStatus.FOUL},
                        {playerId: "player4Id", maal: 0, status: PlayerRoundStatus.UNSEEN},
                        {playerId: "player5Id", maal: 0, status: PlayerRoundStatus.FOUL},
                    ],
                },
                scores: [
                    {playerId: "player1Id", point: 51, nextRoundPointAdjustment: 0},
                    {playerId: "player2Id", point: -5, nextRoundPointAdjustment: 0},
                    {playerId: "player3Id", point: -12, nextRoundPointAdjustment: -15},
                    {playerId: "player4Id", point: -22, nextRoundPointAdjustment: 0},
                    {playerId: "player5Id", point: -12, nextRoundPointAdjustment: -15},
                ]
            },
        ];

        scenarios.forEach(({round, scores}, index) =>
            it(`should calculate scores with default settings for scenario #${index}`, () => {
                const calculatedScores = calculateScores(round, defaultGameSettings);
                expect(calculatedScores).toEqual(expect.arrayContaining(scores));
            })
        );
    });

    describe('With Custom Settings', () => {
        type Scenario = { round: Round, settings: GameSettings, scores: Score[] };

        const scenarios: Scenario[] = [
            {
                round: {
                    winnerPlayerId: "player1Id",
                    dubleeWin: false,
                    results: [
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
                scores: [
                    {playerId: "player1Id", point: 18, nextRoundPointAdjustment: 0},
                    {playerId: "player2Id", point: 0, nextRoundPointAdjustment: 0},
                    {playerId: "player3Id", point: -15, nextRoundPointAdjustment: 0},
                    {playerId: "player4Id", point: -3, nextRoundPointAdjustment: -20},
                ]
            },

            {
                round: {
                    winnerPlayerId: "player2Id",
                    dubleeWin: true,
                    results: [
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
                scores: [
                    {playerId: "player1Id", point: -9, nextRoundPointAdjustment: 0},
                    {playerId: "player2Id", point: 38, nextRoundPointAdjustment: 0},
                    {playerId: "player3Id", point: -18, nextRoundPointAdjustment: 0},
                    {playerId: "player4Id", point: -11, nextRoundPointAdjustment: -12},
                    {playerId: "player5Id", point: 0, nextRoundPointAdjustment: 0},
                ]
            },
        ];

        scenarios.forEach(({round, settings, scores}, index) =>
            it(`should calculate scores with custom settings for Scenario #${index}`, () => {
                const calculatedScores = calculateScores(round, settings);
                expect(calculatedScores).toEqual(expect.arrayContaining(scores));
            })
        );
    });

    describe('With nextRoundPointAdjustment', () => {
        // TODO:
    });
})