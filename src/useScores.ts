import {db} from "./db";
import {useTableWithGameId} from "./useDb";
import {useLiveQuery} from "dexie-react-hooks";

export const useScores = (gameId: string) => useTableWithGameId(gameId, db.scores);

export const useRoundScores = (roundId: string | undefined) =>
    useLiveQuery(async () => {
        if (roundId) {
            return db.scores.where("roundId").equals(roundId).toArray();
        }
        return [];
    }, [roundId]);
