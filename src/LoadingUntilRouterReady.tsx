import {FC, ReactElement} from "react";
import {useRouter} from "next/router";
import {Loading} from "./Loading";
import {ParsedUrlQuery} from "querystring";

type LoadingUntilRouterReadyProps = {
    onReady: (query: ParsedUrlQuery) => ReactElement
};

export const LoadingUntilRouterReady: FC<LoadingUntilRouterReadyProps> = ({onReady}) => {
    const router = useRouter();
    const {isReady} = router;

    if (!isReady) {
        return <Loading/>
    }

    return (
        <>
            {onReady(router.query)}
        </>
    );
}