import {Points} from "../../src/Points";
import {useRouteGameId} from "../../src/useRouteGameId";
import {NextPage} from "next";

const PointsPage: NextPage = () => <Points gameId={useRouteGameId()}/>;
export default PointsPage;