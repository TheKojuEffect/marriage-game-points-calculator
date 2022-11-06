import {FC} from "react";
import {decode} from "./codec";
import {DbGame, DbPlayer, DbRound, DbScore, DbSettings} from "./db";
import {useRouter} from "next/router";

export interface GameData {
    game: DbGame,
    settings: DbSettings,
    players: DbPlayer[],
    rounds: DbRound[],
    scores: DbScore[],
}

const isGameData = (data: any): data is GameData => {
    const gameData = data as GameData;
    return gameData.game !== undefined
        && gameData.settings !== undefined
        && gameData.players !== undefined
        && gameData.rounds !== undefined
        && gameData.scores !== undefined;
}

export const Shared: FC<{ game: string | undefined }> = ({game}) => {
    const router = useRouter()
    if (!game) {
        return null;
    }
    const data = decode(game);
    if (!isGameData(data)) {
        void router.push("/");
        return null;
    }
    console.log({data})
    return <span>{game}</span>;

}