import {Scores} from "../../src/Scores";
import {useRouteGameId} from "../../src/useRouteGameId";
import {NextPage} from "next";

const ScoresPage: NextPage = () => <Scores gameId={useRouteGameId()}/>;
export default ScoresPage;