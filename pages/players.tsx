import {Players} from "../src/Players";
import {NextPage} from "next";
import {LoadingUntilRouterReady} from "../src/LoadingUntilRouterReady";
import {getGameId} from "../src/getGameId";

const PlayersPage: NextPage = () =>
    <LoadingUntilRouterReady onReady={query =>
        <Players gameId={getGameId(query)}/>
    }/>;
export default PlayersPage;