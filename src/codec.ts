import {compressToEncodedURIComponent, decompressFromEncodedURIComponent} from "lz-string";
import {GameData} from "./Share";
import {groupBy, sortBy} from "lodash";
import {DbGame, DbPlayer, DbRound, DbScore, DbSettings} from "./db";

type GameId = string;
type PlayerId = string;
type RoundId = string;

type NormGame = [GameId, Date];
type NormSettings = [number, number, number, number, number];
type NormPlayer = [PlayerId, string];
type NormScore = [PlayerId, number, number, number]
type NormRound = [RoundId, Date, PlayerId, boolean, [NormScore[]]];

type NormalizedGameData = [
    number, // version
    NormGame,
    NormSettings,
    [NormPlayer[]],
    [NormRound[]]
];

const toNormGame = (game: DbGame): NormGame =>
    [game.id, game.createdAt];

const fromNormGame = (normGame: NormGame): DbGame => {
    const [id, createdAt] = normGame;
    return {id, createdAt};
}

const toNormSettings = (settings: DbSettings): NormSettings => {
    const {pointRate, seenPoint, unseenPoint, foulPoint, dubleeWinBonusPoint} = settings;
    return [pointRate, seenPoint, unseenPoint, foulPoint, dubleeWinBonusPoint];
}

const fromNormSettings = (normSettings: NormSettings, {id: gameId}: DbGame): DbSettings => {
    const [pointRate, seenPoint, unseenPoint, foulPoint, dubleeWinBonusPoint] = normSettings;
    return {gameId, pointRate, seenPoint, unseenPoint, foulPoint, dubleeWinBonusPoint};
}

const toNormPlayers = (players: DbPlayer[]): NormPlayer[] =>
    sortBy(players, p => p.index)
        .map(p => [p.id, p.name]);

const fromNormPlayers = (normPlayers: NormPlayer[], {id: gameId}: DbGame): DbPlayer[] =>
    normPlayers.map((normPlayer, index) => {
        const [id, name] = normPlayer;
        return {gameId, id, name, index};
    });

const toNormScores = (scores: DbScore[]): NormScore[] =>
    scores.map(s => [s.playerId, s.maal, s.status, s.point]);

const fromNormScores = (normScores: NormScore[], {id: roundId, gameId}: DbRound): DbScore[] =>
    normScores.map(normScore => {
        const [playerId, maal, status, point] = normScore;
        return {roundId, gameId, playerId, maal, status, point};
    });

const toNormRounds = (rounds: DbRound[], roundScores: Record<RoundId, DbScore[]>): NormRound[] =>
    rounds.map(r => [r.id, r.createdAt, r.winnerPlayerId, r.dubleeWin, [toNormScores(roundScores[r.id])]]);

const fromNormRound = (normRound: NormRound, {id: gameId}: DbGame): [DbRound, DbScore[]] => {
    const [id, createdAt, winnerPlayerId, dubleeWin, [normScores]] = normRound;
    const round: DbRound = {id, createdAt, winnerPlayerId, dubleeWin, gameId};
    const roundScores: DbScore[] = fromNormScores(normScores, round);
    return [round, roundScores];
}

const fromNormRounds = (normRounds: NormRound[], game: DbGame): [DbRound[], DbScore[]] => {
    const roundAndScores: [DbRound, DbScore[]][] =
        normRounds.map(normRound => fromNormRound(normRound, game));

    return roundAndScores
        .reduce((acc: [DbRound[], DbScore[]], value: [DbRound, DbScore[]]) => {
            const [rounds, allRoundScores] = acc;
            const [round, roundScores] = value;
            return [[...rounds, round], [...allRoundScores, ...roundScores]];
        }, [[] as DbRound[], [] as DbScore[]]);
}

const normalizeData = (gameData: GameData): NormalizedGameData => {
    const {game, settings, players, rounds, scores} = gameData;
    const normGame: NormGame = toNormGame(game);
    const normSettings: NormSettings = toNormSettings(settings);
    const normPlayers: NormPlayer[] = toNormPlayers(players);
    const roundScores: Record<RoundId, DbScore[]> = groupBy(scores, s => s.roundId);
    const normRounds: NormRound[] = toNormRounds(rounds, roundScores);

    return [
        0,
        normGame,
        normSettings,
        [normPlayers],
        [normRounds]
    ];
}

const denormalizeData = (normalized: NormalizedGameData): GameData => {
    const [_, normGame, normSettings, [normPlayers], [normRounds]] = normalized;
    const game: DbGame = fromNormGame(normGame);
    const settings: DbSettings = fromNormSettings(normSettings, game);
    const players: DbPlayer[] = fromNormPlayers(normPlayers, game);
    const [rounds, scores] = fromNormRounds(normRounds, game);
    return {game, settings, players, rounds, scores};
}

export const encodeGameData = (gameData: GameData): string =>
    compressToEncodedURIComponent(JSON.stringify(normalizeData(gameData)));

export const decodeGameData = (encoded: string): GameData =>
    denormalizeData(JSON.parse(decompressFromEncodedURIComponent(encoded)!, dateReviver));

function dateReviver(_: any, value: any) {
    // If the value is a string and if it roughly looks like it could be a
    // JSON-style date string go ahead and try to parse it as a Date object.
    if ('string' === typeof value && /^\d{4}-[01]\d-[0-3]\dT[012]\d(?::[0-6]\d){2}\.\d{3}Z$/.test(value)) {
        const date = new Date(value);
        // If the date is valid then go ahead and return the date object.
        if (+date === +date) {
            return date;
        }
    }
    // If a date was not returned, return the value that was passed in.
    return value;
}