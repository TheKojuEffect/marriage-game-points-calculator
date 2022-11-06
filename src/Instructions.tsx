import {FC} from "react";
import Link from "next/link";
import {Stack} from "@mui/material";

export const Instructions: FC = () =>
    <Stack direction="column" spacing={3}>
        <Link href="https://en.wikipedia.org/wiki/Marriage_(card_game)">
            Marriage Card Game Instructions
        </Link>
    </Stack>