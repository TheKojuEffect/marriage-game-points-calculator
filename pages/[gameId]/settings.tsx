import {Settings} from "../../src/Settings";
import {NextPage} from "next";
import {useRouteGameId} from "../../src/useRouteGameId";

const SettingsPage: NextPage = () => <Settings gameId={useRouteGameId()}/>;
export default SettingsPage;