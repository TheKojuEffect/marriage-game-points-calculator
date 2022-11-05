import {db} from "./db";
import {useTableWithGameId} from "./useDb";

export const useRounds = (gameId: string) => useTableWithGameId(gameId, db.rounds);