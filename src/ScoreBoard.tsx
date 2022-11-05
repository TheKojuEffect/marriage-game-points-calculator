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

export const ScoreBoard: FC<GameIdProp> = ({gameId}) => {
    const rounds = useRounds(gameId);
    const scores = useScores(gameId);
    const players = usePlayers(gameId);

    if (!rounds || !scores || !players) {
        return <Loading/>;
    }

    const getPoint = ({id: roundId}: DbRound, {id: playerId}: DbPlayer): number =>
        scores.find(s => s.playerId === playerId && s.roundId === roundId)?.point ?? 0;

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Round</TableCell>
                        {
                            players.map(player =>
                                <TableCell key={player.id} align="center">{player.name}</TableCell>
                            )
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        rounds.map(round =>
                            <TableRow key={round.id}>
                                <TableCell>
                                    {round.createdAt.toLocaleString()}
                                </TableCell>
                                {
                                    players.map(player =>
                                        <TableCell align="center">{getPoint(round, player)}</TableCell>
                                    )
                                }

                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}