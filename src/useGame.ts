import {useQueryWithGameId} from "./useDb";
import {db, DbGame} from "./db";

export const getGameById = (gameId: string) => db.games.get({id: gameId});

export const useGame = (gameId: string | undefined): DbGame | undefined =>
    useQueryWithGameId(gameId, () => getGameById(gameId!));