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
        await router.push(`/settings?gameId=${gameId}`);
    }

    return (
        <Stack spacing={3}>
            <Button variant="contained" onClick={newGame}>New Game</Button>
            <Link href="/games" legacyBehavior>
                <Button variant="contained">Previous Games</Button>
            </Link>
            <Link href="/instructions" legacyBehavior>
                <Button variant="contained">Instructions</Button>
            </Link>
            <Link href="/about" legacyBehavior>
                <Button variant="contained">About</Button>
            </Link>
        </Stack>
    )
};