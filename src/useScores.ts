import {db} from "./db";
import {useTableWithGameId} from "./useDb";

export const useScores = (gameId: string) => useTableWithGameId(gameId, db.scores);