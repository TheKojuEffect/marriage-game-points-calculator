import {FC} from "react";
import {GameIdProp} from "./GameIdProp";
import {usePlayers} from "./usePlayers";
import {useScores} from "./useScores";
import {useRounds} from "./useRounds";
import {Loading} from "./Loading";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {DbPlayer, DbRound} from "./db";
import Box from "@mui/material/Box";
import {Button, Stack, Tooltip} from "@mui/material";
import {mergeWith} from "lodash";
import Link from "next/link";

type PlayerPoints = Record<string, number>;
type RoundPlayerPoints = Record<string, PlayerPoints>;

export const ScoreBoard: FC<GameIdProp> = ({gameId}) => {
    const rounds = useRounds(gameId);
    const scores = useScores(gameId);
    const players = usePlayers(gameId);

    if (!rounds || !scores || !players) {
        return <Loading/>;
    }

    const getPoint = ({id: roundId}: DbRound, {id: playerId}: DbPlayer): number =>
        scores.find(s => s.playerId === playerId && s.roundId === roundId)?.point ?? 0;

    const getPlayerPoints = (round: DbRound): PlayerPoints =>
        Object.fromEntries(players.map(player => [player.id, getPoint(round, player)]));

    const roundPlayerPoints: RoundPlayerPoints =
        Object.fromEntries(rounds.map(round => [round.id, getPlayerPoints(round)]));

    const totalPlayerPoints: PlayerPoints =
        mergeWith({},
            ...Object.values(roundPlayerPoints),
            (objValue: number = 0, srcValue: number = 0) => {
                return objValue + srcValue;
            });

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Total</TableCell>
                            {
                                players.map(player =>
                                    <TableCell key={player.id} align="center">{player.name}</TableCell>
                                )
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                Points
                            </TableCell>
                            {
                                players.map(player =>
                                    <TableCell key={player.id} align="center">{totalPlayerPoints[player.id]}</TableCell>
                                )
                            }
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                Amount
                            </TableCell>
                            {
                                players.map(player =>
                                    <TableCell key={player.id} align="center">0</TableCell>
                                )
                            }

                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack spacing={3} sx={{my: 3}}>
                <Link href={`/${gameId}/scores`} legacyBehavior>
                    <Button variant="contained">Next Round</Button>
                </Link>
                <Button variant="contained">Continue in Another Device</Button>
            </Stack>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Round</TableCell>
                            {
                                players.map(player =>
                                    <TableCell key={player.id} align="center">{player.name}</TableCell>
                                )
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            rounds.map((round, index) =>
                                <TableRow key={round.id}>
                                    <TableCell align="center">
                                        <Tooltip title={round.createdAt.toLocaleString()} arrow>
                                            <span>
                                                {rounds.length - index}
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                    {
                                        players.map(player =>
                                            <TableCell key={player.id} align="center">{roundPlayerPoints[round.id][player.id]}</TableCell>
                                        )
                                    }

                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}