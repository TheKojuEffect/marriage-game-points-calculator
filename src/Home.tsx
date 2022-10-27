import {Button, Link, Stack} from "@mui/material";
import {FC} from "react";

export const Home: FC = () => {
    return (
        <Stack spacing={3}>
            <Link href="/settings">
                <Button variant="contained" fullWidth>New Game</Button>
            </Link>
            <Button variant="contained">Previous Games</Button>
            <Button variant="contained">Instructions</Button>
            <Button variant="contained">About</Button>
        </Stack>
    )
};