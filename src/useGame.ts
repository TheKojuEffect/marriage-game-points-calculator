import {useQueryWithGameId} from "./useDb";
import {db, DbGame} from "./db";

export const useGame = (gameId: string): DbGame | undefined =>
    useQueryWithGameId(gameId, () => db.games.get({id: gameId}));