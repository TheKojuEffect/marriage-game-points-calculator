import {useLiveQuery} from "dexie-react-hooks";
import {Table} from "dexie";
import {db, DbGame} from "./db";
import {head} from "lodash";

export const useQueryWithGameId = <T>(gameId: string | undefined, querier: () => Promise<T> | T): T | undefined =>
    useLiveQuery(async () => {
        if (gameId) {
            return querier();
        }
        return undefined;
    }, [gameId]);

export const useTableWithGameId = <T>(gameId: string, table: Table<T, any>): T[] | undefined =>
    useQueryWithGameId(gameId, () => table.where("gameId").equals(gameId).toArray());

export const getGameById = (gameId: string) => db.games.get({id: gameId});

export const useGame = (gameId: string | undefined): DbGame | undefined =>
    useQueryWithGameId(gameId, () => getGameById(gameId!));

export const usePlayers = (gameId: string) =>
    useTableWithGameId(gameId, db.players)
        ?.sort((a, b) => a.index - b.index);

export const useRounds = (gameId: string) =>
    useTableWithGameId(gameId, db.rounds)
        ?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

export const useScores = (gameId: string) => useTableWithGameId(gameId, db.scores);

export const useRoundScores = (roundId: string | undefined) =>
    useLiveQuery(async () => {
        if (roundId) {
            return db.scores.where("roundId").equals(roundId).toArray();
        }
        return [];
    }, [roundId]);

export const useSettings = (gameId: string) =>
    head(useTableWithGameId(gameId, db.settings));