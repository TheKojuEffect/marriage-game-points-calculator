import {Button} from "@mui/material";
import {useRouter} from "next/router";
import {db, generateId} from "./db";
import {FC} from "react";

export const NewGame: FC = () => {
    const router = useRouter();
    const newGame = async () => {
        const gameId = generateId();
        await db.games.add({
            id: gameId,
            createdAt: new Date(),
        });
        await router.push(`/settings?gameId=${gameId}`);
    }
    return (
        <Button variant="contained" onClick={newGame}>
            New Game
        </Button>
    );
};