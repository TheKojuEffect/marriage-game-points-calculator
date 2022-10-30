import {FC} from "react";
import {GameIdProp} from "./GameIdProp";

export const Points: FC<GameIdProp> = ({gameId}) => {
    return <span>{gameId}</span>
}