import {useLiveQuery} from "dexie-react-hooks";
import {Table} from "dexie";

export const useQueryWithGameId = <T>(gameId: string | undefined, querier: () => Promise<T> | T): T | undefined =>
    useLiveQuery(async () => {
        if (gameId) {
            return querier();
        }
        return undefined;
    }, [gameId]);

export const useTableWithGameId = <T>(gameId: string, table: Table<T, any>): T[] | undefined =>
    useQueryWithGameId(gameId, () => table.where("gameId").equals(gameId).toArray());