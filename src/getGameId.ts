import {ParsedUrlQuery} from "querystring";
import {isValidateId} from "./utils";

export const getGameId = (query: ParsedUrlQuery): string => {
    const {gameId} = query;
    if (typeof gameId === "string" && isValidateId(gameId)) {
        return gameId;
    }
    throw new Error("Invalid gameId");
}