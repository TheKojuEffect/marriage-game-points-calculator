import {FC, useEffect, useState} from "react";
import {decode} from "./codec";
import {db, DbGame, DbPlayer, DbRound, DbScore, DbSettings} from "./db";
import {useRouter} from "next/router";
import {Loading} from "./Loading";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {useGame} from "./useGame";

export interface GameData {
    game: DbGame,
    settings: DbSettings,
    players: DbPlayer[],
    rounds: DbRound[],
    scores: DbScore[],
}

const isGameData = (data: any): data is GameData => {
    const gameData = data as GameData;
    return gameData.game !== undefined
        && gameData.settings !== undefined
        && gameData.players !== undefined
        && gameData.rounds !== undefined
        && gameData.scores !== undefined;
}

export const Shared: FC<{ game: string | undefined }> = ({game}) => {
    const router = useRouter()
    const [updatingDb, setUpdatingDb] = useState(false);
    const [processed, setProcessed] = useState(false);
    const [validData, setValidData] = useState(false);
    const [gameData, setGameData] = useState<GameData | undefined>(undefined);

    useEffect(() => {
        if (!game) {
            return;
        }
        try {
            const data = decode(game);
            const valid = isGameData(data);
            setValidData(valid);
            if (valid) {
                setGameData(data);
            }
        } catch (ex) {
            setValidData(false);
        } finally {
            setProcessed(true);
        }
    }, [game]);

    const gameId = gameData?.game.id;
    const existingGame = useGame(gameId);

    if (!game || !processed || updatingDb) {
        return <Loading/>
    }

    const gotoHome = () => router.push("/");

    const gotoScoreboard = (gameId: string) => router.push(`/${gameId}/scoreboard`);

    if (!validData) {
        return (
            <Dialog
                open={true}
                onClose={gotoHome}
            >
                <DialogTitle>
                    Invalid Shared Data
                </DialogTitle>
                <DialogContent>
                    The shared data is not valid. Please verify the shared URL.
                </DialogContent>
                <DialogActions>
                    <Button onClick={gotoHome}>Go to Home</Button>
                </DialogActions>
            </Dialog>
        );
    }

    const saveGameData = async ({
        game,
        settings,
        players,
        rounds,
        scores
    }: GameData) => {
        await db.transaction("rw", db.games, db.settings, db.players, db.rounds, db.scores, async () => {
            await db.games.add(game);
            await db.settings.add(settings);
            await db.players.bulkAdd(players);
            await db.rounds.bulkAdd(rounds);
            await db.scores.bulkAdd(scores);
        });
        setUpdatingDb(false);
    }

    const deleteExitingGameData = async (gameId: string) => {
        await db.transaction("rw", db.games, db.settings, db.players, db.rounds, db.scores, async () => {
            await db.games.where("id").equals(gameId).delete();
            await db.settings.where("gameId").equals(gameId).delete();
            await db.players.where("gameId").equals(gameId).delete();
            await db.rounds.where("gameId").equals(gameId).delete();
            await db.scores.where("gameId").equals(gameId).delete();
        });
    }

    const continueGame = async () => {
        setUpdatingDb(true);
        await saveGameData(gameData!);
        await gotoScoreboard(gameData!.game.id);
    }

    const overwriteExistingGame = async () => {
        setUpdatingDb(true);
        await deleteExitingGameData(existingGame!.id);
        await saveGameData(gameData!);
        await gotoScoreboard(gameData!.game.id);
    }

    if (existingGame) {
        return (
            <Dialog
                open={true}
            >
                <DialogTitle>
                    Existing Game
                </DialogTitle>
                <DialogContent>
                    This game already exists in your device.
                </DialogContent>
                <DialogActions>
                    <Button onClick={gotoHome}>Go to Home</Button>
                    <Button variant="outlined" color="info" onClick={() => gotoScoreboard(existingGame.id)}>View Existing</Button>
                    <Button variant="outlined" color="warning" onClick={overwriteExistingGame}>Overwrite</Button>
                </DialogActions>
            </Dialog>
        );
    }


    if (validData && !existingGame) {
        return (
            <Dialog
                open={true}
            >
                <DialogTitle>
                    Continue Game
                </DialogTitle>
                <DialogContent>
                    Do you want to continue this shared game?
                </DialogContent>
                <DialogActions>
                    <Button onClick={gotoHome}>Go to Home</Button>
                    <Button variant="outlined" color="success" onClick={continueGame}>Continue</Button>
                </DialogActions>
            </Dialog>
        );
    }

    return <Loading/>;

}