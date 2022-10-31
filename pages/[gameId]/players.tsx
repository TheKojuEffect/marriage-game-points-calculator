import {Players} from "../../src/Players";
import {useRouteGameId} from "../../src/useRouteGameId";
import {NextPage} from "next";

const PlayersPage: NextPage = () => <Players gameId={useRouteGameId()}/>;
export default PlayersPage;