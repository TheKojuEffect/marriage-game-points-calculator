import {FC} from "react";
import Link from "next/link";
import {Stack} from "@mui/material";

export const About: FC = () =>
    <Stack direction="column" spacing={3}>
        <Link href="https://github.com/TheKojuEffect/marriage-game-points-calculator">
            Source Code
        </Link>
        <Link href="https://github.com/TheKojuEffect/marriage-game-points-calculator/issues">
            Bug Reports and Feature Requests
        </Link>
        <Link href="https://koju.dev/">
            Developed by Kapil Koju
        </Link>
    </Stack>