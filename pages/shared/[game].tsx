import {NextPage} from "next";
import {Shared} from "../../src/Shared";
import {useRouter} from "next/router";

const SharedPage: NextPage = () => {
    const router = useRouter();
    const {game} = router.query;
    return <Shared game={game as string}/>;
};
export default SharedPage;
