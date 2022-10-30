import {Players} from "../../src/Players";
import {useRouteGameId} from "../../src/useRouteGameId";

export default () => {
    return <Players gameId={useRouteGameId()}/>;
};