import {FC, useState} from "react";
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
import {Button, Stack, TextField} from "@mui/material";
import {mergeWith} from "lodash";
import Link from "next/link";
import {useSettings} from "./useSettings";
import {useGame} from "./useGame";
import {encode} from "./codec";
import {useRouter} from "next/router";
import {GameData} from "./Share";

type PlayerPoints = Record<string, number>;
type RoundPlayerPoints = Record<string, PlayerPoints>;

export const ScoreBoard: FC<GameIdProp> = ({gameId}) => {
    const game = useGame(gameId);
    const rounds = useRounds(gameId);
    const scores = useScores(gameId);
    const players = usePlayers(gameId);
    const settings = useSettings(gameId);

    const router = useRouter();
    const [shareUrl, setShareUrl] = useState('');

    if (!game || !rounds || !scores || !players || !settings) {
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

    const amountFormat = new Intl.NumberFormat();

    const shareGame = async () => {
        const gameData: GameData = {game, settings, players, rounds, scores};
        const param = encode(gameData);
        const url = `${window.location.origin}/share?game=${param}`;
        if (navigator.share) {
            await navigator.share({
                title: "Continue the Marriage Game",
                url
            });
        } else {
            setShareUrl(url);
        }
    }

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
                                Amount @{amountFormat.format(settings.pointRate)}/point
                            </TableCell>
                            {
                                players.map(player =>
                                    <TableCell key={player.id} align="center">
                                        {amountFormat.format(totalPlayerPoints[player.id] * settings.pointRate)}
                                    </TableCell>
                                )
                            }

                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack spacing={3} sx={{my: 3}}>
                <Link href={`/scores?gameId=${gameId}`} legacyBehavior>
                    <Button variant="contained">Next Round</Button>
                </Link>
                <Button variant="contained" onClick={shareGame}>Share and Continue In Another Device</Button>

                {
                    shareUrl &&
                    <TextField variant="outlined"
                               label="Share the URL to continue in another device"
                               multiline
                               maxRows={2}
                               InputProps={{readOnly: true}} defaultValue={shareUrl}/>
                }

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
                                        <Link href={`/scores?gameId=${gameId}&roundId=${round.id}`}>
                                            #{rounds.length - index}
                                        </Link>
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