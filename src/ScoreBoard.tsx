import {FC, useState} from "react";
import {GameIdProp} from "./GameIdProp";
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
import {Button, InputAdornment, Stack, TextField} from "@mui/material";
import {mergeWith} from "lodash";
import Link from "next/link";
import {encodeGameData} from "./codec";
import {useRouter} from "next/router";
import {GameData} from "./Share";
import IconButton from "@mui/material/IconButton";
import {ContentCopy, ContentCopyTwoTone, Settings, Share, Start} from "@mui/icons-material";
import {useGame, usePlayers, useRounds, useScores, useSettings} from "./useDb";

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
    const [shareUrlCopied, setShareUrlCopied] = useState(false);

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

    const getTotalPoints = (player: DbPlayer) => totalPlayerPoints[player.id] ?? 0;

    const amountFormat = new Intl.NumberFormat();

    const shareGame = async () => {
        const gameData: GameData = {game, settings, players, rounds, scores};
        console.log(gameData)

        const param = encodeGameData(gameData);
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

    const copyShareUrl = async () => {
        await navigator.clipboard.writeText(shareUrl)
        setShareUrlCopied(true);
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
                                    <TableCell key={player.id} align="center">{getTotalPoints(player)}</TableCell>
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
                                        {amountFormat.format(getTotalPoints(player) * settings.pointRate)}
                                    </TableCell>
                                )
                            }

                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack spacing={3} sx={{my: 3}}>
                <Stack direction="row" spacing={2}>
                    <Link href={`/settings?gameId=${gameId}`} legacyBehavior>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="info"
                            startIcon={<Settings/>}
                        >
                            Settings
                        </Button>
                    </Link>
                    <Link href={`/scores?gameId=${gameId}`} legacyBehavior>
                        <Button
                            fullWidth
                            variant="contained"
                            endIcon={<Start/>}
                        >
                            New Round
                        </Button>
                    </Link>
                </Stack>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={shareGame}
                    endIcon={<Share/>}
                >
                    Continue In Another Device
                </Button>

                {
                    shareUrl &&
                    <TextField
                        variant="filled"
                        label="Share the URL to continue in another device"
                        defaultValue={shareUrl}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={copyShareUrl}
                                        title={`${shareUrlCopied ? "Copied" : "Copy"} to Clipboard`}
                                        edge="end"
                                    >
                                        {shareUrlCopied ? <ContentCopyTwoTone/> : <ContentCopy/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
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