import {db} from "./db";
import {useTableWithGameId} from "./useDb";

export const useRounds = (gameId: string) =>
    useTableWithGameId(gameId, db.rounds)
        ?.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());