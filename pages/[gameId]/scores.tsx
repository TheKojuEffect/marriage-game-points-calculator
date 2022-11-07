import {Scores} from "../../src/Scores";
import {NextPage} from "next";
import {LoadingUntilRouterReady} from "../../src/LoadingUntilRouterReady";
import {Settings} from "../../src/Settings";
import {getGameId} from "../../src/getGameId";

const ScoresPage: NextPage = () =>
    <LoadingUntilRouterReady onReady={query =>
        <Scores gameId={getGameId(query)}/>
    }/>;

export default ScoresPage;