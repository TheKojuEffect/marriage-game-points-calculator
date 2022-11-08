import {FC, useEffect} from "react";
import {ListItem, ListItemButton} from "@mui/material";
import {useLiveQuery} from "dexie-react-hooks";
import {db, DbGame, DbPlayer} from "./db";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import {Loading} from "./Loading";
import Link from "next/link";
import {groupBy, isEmpty, partition} from "lodash";

export const Games: FC = () => {
    const games =
        useLiveQuery(() => db.games.toArray())
            ?.sort((g1, g2) => g2.createdAt.getTime() - g1.createdAt.getTime());

    const players = useLiveQuery(() => db.players.toArray())
        ?.sort((p1, p2) => p1.index - p2.index);

    const settings = useLiveQuery(() => db.settings.toArray());

    const gamePlayers: Record<string, DbPlayer[]> = groupBy(players, p => p.gameId);

    const [gamesWithoutPlayers, gamesWithPlayers] = partition(games, g => isEmpty(gamePlayers[g.id]));

    const getGamePlayerNames = (game: DbGame): string =>
        gamePlayers[game.id].map(p => p.name).join(', ');

    useEffect(() => {
        const gameIdsToDelete = gamesWithoutPlayers.map(g => g.id);
        db.settings.bulkDelete(gameIdsToDelete);
        db.games.bulkDelete(gameIdsToDelete);
    }, [games])

    if (!games || !players || !settings) {
        return <Loading/>;
    }

    return (
        <List>
            {gamesWithPlayers.map(game =>
                <ListItem key={game.id} disablePadding>
                    <Link href={`/scoreboard/?gameId=${game.id}`} legacyBehavior>
                        <ListItemButton>
                            <ListItemText
                                primary={game.createdAt.toLocaleString()}
                                secondary={getGamePlayerNames(game)}
                            />
                        </ListItemButton>
                    </Link>
                </ListItem>
            )}
        </List>
    );

}