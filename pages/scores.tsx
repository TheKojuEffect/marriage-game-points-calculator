import {Scores} from "../src/Scores";
import {NextPage} from "next";
import {LoadingUntilRouterReady} from "../src/LoadingUntilRouterReady";
import {getGameId} from "../src/getGameId";

const ScoresPage: NextPage = () =>
    <LoadingUntilRouterReady onReady={query =>
        <Scores gameId={getGameId(query)} roundId={query.roundId as string | undefined}/>
    }/>;

export default ScoresPage;