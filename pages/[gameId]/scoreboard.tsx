import {NextPage} from "next";
import {ScoreBoard} from "../../src/ScoreBoard";
import {LoadingUntilRouterReady} from "../../src/LoadingUntilRouterReady";
import {Scores} from "../../src/Scores";
import {getGameId} from "../../src/getGameId";

const ScoreBoardPage: NextPage = () =>
    <LoadingUntilRouterReady onReady={query =>
        <ScoreBoard gameId={getGameId(query)}/>
    }/>;
export default ScoreBoardPage;