import {db} from "./db";
import {useTableWithGameId} from "./useDb";
import {head} from "lodash";

export const useSettings = (gameId: string) =>
    head(useTableWithGameId(gameId, db.settings));