import {NextPage} from "next";
import {Share} from "../src/Share";
import {LoadingUntilRouterReady} from "../src/LoadingUntilRouterReady";

const SharePage: NextPage = () =>
    <LoadingUntilRouterReady onReady={query =>
        <Share game={query.game as string}/>
    }/>;
export default SharePage;
