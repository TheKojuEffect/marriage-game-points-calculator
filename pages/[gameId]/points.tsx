import {Points} from "../../src/Points";
import {useRouteGameId} from "../../src/useRouteGameId";

export default () => {
    return <Points gameId={useRouteGameId()}/>;
};