import {FC} from "react";
import {GameIdProp} from "./GameIdProp";

export const ScoreBoard: FC<GameIdProp> = ({gameId}) => <span>Score Board {gameId}</span>;