import {FC} from "react";
import {GameIdProp} from "./GameIdProp";
import {usePlayers} from "./usePlayers";
import {useScores} from "./useScores";
import {useRounds} from "./useRounds";
import {Loading} from "./Loading";

type ScoreLine = {
    roundId: string;
    roundDate: Date;
    playerId: string;
    point: number;
}

export const ScoreBoard: FC<GameIdProp> = ({gameId}) => {
    const rounds = useRounds(gameId);
    const scores = useScores(gameId);
    const players = usePlayers(gameId);

    if (!rounds || !scores || !players) {
        return <Loading/>;
    }

    console.log({rounds, scores, players});

    return <span>Score Board {gameId}</span>;
};