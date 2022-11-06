import {Button, Stack} from "@mui/material";
import {FC} from "react";
import {useRouter} from "next/router";
import {db, generateId} from "./db";
import Link from "next/link";

export const Home: FC = () => {
    const router = useRouter();
    const newGame = async () => {
        const gameId = generateId();
        await db.games.add({
            id: gameId,
            createdAt: new Date(),
        });
        await router.push(`/${gameId}/settings`);
    }

    return (
        <Stack spacing={3}>
            <Button variant="contained" onClick={newGame}>New Game</Button>
            <Button variant="contained">Previous Games</Button>
            <Button variant="contained">Instructions</Button>
            <Link href="/about" legacyBehavior>
                <Button variant="contained">About</Button>
            </Link>
        </Stack>
    )
};