import {useRouteGameId} from "../../src/useRouteGameId";
import {NextPage} from "next";
import {ScoreBoard} from "../../src/ScoreBoard";

const ScoreBoardPage: NextPage = () => <ScoreBoard gameId={useRouteGameId()}/>;
export default ScoreBoardPage;