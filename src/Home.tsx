import {Button, Stack} from "@mui/material";
import {FC} from "react";
import Link from "next/link";
import {NewGame} from "./NewGame";

export const Home: FC = () =>
    <Stack spacing={3}>
        <NewGame/>
        <Link href="/games" legacyBehavior>
            <Button variant="contained">Previous Games</Button>
        </Link>
        <Link href="/instructions" legacyBehavior>
            <Button variant="contained">Instructions</Button>
        </Link>
        <Link href="/about" legacyBehavior>
            <Button variant="contained">About</Button>
        </Link>
    </Stack>;