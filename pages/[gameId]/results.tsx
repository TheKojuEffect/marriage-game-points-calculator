import {Results} from "../../src/Results";
import {useRouteGameId} from "../../src/useRouteGameId";
import {NextPage} from "next";

const ResultsPage: NextPage = () => <Results gameId={useRouteGameId()}/>;
export default ResultsPage;