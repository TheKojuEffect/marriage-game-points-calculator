import {db} from "./db";
import {useTableWithGameId} from "./useDb";

export const usePlayers = (gameId: string) =>
    useTableWithGameId(gameId, db.players)
        ?.sort((a, b) => a.index - b.index);
