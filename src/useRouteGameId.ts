import {useRouter} from "next/router";

export const useRouteGameId = () => {
    const router = useRouter();
    const {gameId} = router.query;
    return gameId as string;
}