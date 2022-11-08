import {FC, useCallback, useEffect, useRef, useState} from "react";
import {decodeGameData} from "./codec";
import {db, DbGame, DbPlayer, DbRound, DbScore, DbSettings} from "./db";
import {useRouter} from "next/router";
import {Loading} from "./Loading";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {getGameById} from "./useDb";

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

export const Share: FC<{ game: string }> = ({game}) => {
    const router = useRouter()
    const dbPopulated = useRef(false);
    const [processed, setProcessed] = useState(false);
    const [validData, setValidData] = useState(false);
    const [existingGame, setExistingGame] = useState(false);
    const [gameData, setGameData] = useState<GameData | undefined>(undefined);

    const gotoHome = () => router.push("/");
    const gotoScoreboard = useCallback((gameId: string) => router.push(`/scoreboard?gameId=${gameId}`), [router]);

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
    };

    const deleteExitingGameData = async (gameId: string) => {
        await db.transaction("rw", db.games, db.settings, db.players, db.rounds, db.scores, async () => {
            await db.games.where("id").equals(gameId).delete();
            await db.settings.where("gameId").equals(gameId).delete();
            await db.players.where("gameId").equals(gameId).delete();
            await db.rounds.where("gameId").equals(gameId).delete();
            await db.scores.where("gameId").equals(gameId).delete();
        });
    };

    const overwriteExistingGame = async () => {
        await deleteExitingGameData(gameData?.game.id!);
        await saveGameData(gameData!);
        await gotoScoreboard(gameData!.game.id);
    }

    useEffect(() => {
        const continueGame = async (gameData: GameData) => {
            if (!dbPopulated.current) {
                dbPopulated.current = true;
                await saveGameData(gameData!);
                await gotoScoreboard(gameData!.game.id);
            }
        }
        try {
            const data = decodeGameData(game);
            const valid = isGameData(data);
            setValidData(valid);
            if (valid) {
                setGameData(data);
                const gameId = data.game.id;
                getGameById(gameId)
                    .then(dbGame => {
                        if (dbGame) {
                            setExistingGame(true);
                        } else {
                            void continueGame(data);
                        }
                    });
            }
        } catch (ex) {
            setValidData(false);
        } finally {
            setProcessed(true);
        }
    }, [game, gotoScoreboard]);

    if (!processed) {
        return <Loading/>
    }

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
                    <Button variant="outlined" color="info" onClick={() => gotoScoreboard(gameData?.game.id!)}>View Existing</Button>
                    <Button variant="outlined" color="warning" onClick={overwriteExistingGame}>Overwrite</Button>
                </DialogActions>
            </Dialog>
        );
    }
    return <Loading/>;
}