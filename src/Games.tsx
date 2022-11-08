import {FC} from "react";
import {ListItem, ListItemButton} from "@mui/material";
import {useLiveQuery} from "dexie-react-hooks";
import {db} from "./db";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import {Loading} from "./Loading";
import Link from "next/link";

export const Games: FC = () => {
    const games =
        useLiveQuery(() => db.games.toArray())
            ?.sort((g1, g2) => g2.createdAt.getTime() - g1.createdAt.getTime());

    if (!games) {
        return <Loading/>;
    }

    return (
        <List>
            {games.map(game =>
                <Link href={`/scoreboard/?gameId=${game.id}`}>
                    <ListItem key={game.id} disablePadding>
                        <ListItemButton>
                            <ListItemText primary={game.createdAt.toLocaleString()}/>
                        </ListItemButton>
                    </ListItem>
                </Link>
            )}
        </List>
    );

}