import {Settings} from "../../src/Settings";
import {NextPage} from "next";
import {LoadingUntilRouterReady} from "../../src/LoadingUntilRouterReady";
import {getGameId} from "../../src/getGameId";

const SettingsPage: NextPage = () =>
    <LoadingUntilRouterReady onReady={query =>
        <Settings gameId={getGameId(query)}/>
    }/>;

export default SettingsPage;