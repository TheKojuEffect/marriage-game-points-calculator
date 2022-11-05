import {FC, useEffect} from "react";
import {GameIdProp} from "./GameIdProp";
import {useLiveQuery} from "dexie-react-hooks";
import {db, DbPlayer, DbRound, DbScore, generateId} from "./db";
import Box from "@mui/material/Box";
import {Button, FormControl, FormControlLabel, ListItem, MenuItem, Select, Stack, TextField} from "@mui/material";
import ListSubheader from "@mui/material/ListSubheader";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Switch from '@mui/material/Switch';
import {calculatePoints} from "./calculatePoints";
import {useRouter} from "next/router";

export enum PlayerRoundStatus {
    UNSEEN = "Unseen",
    SEEN = "Seen",
    FOUL = "Foul",
    PAUSE = "Pause",
}

export interface Round {
    winnerPlayerId: string;
    dubleeWin: boolean;
    scores: {
        playerId: string,
        maal?: number,
        status: PlayerRoundStatus,
    }[]
}

export const Scores: FC<GameIdProp> = ({gameId}) => {
    const router = useRouter();
    const players = useLiveQuery(() => {
        if (gameId) {
            return db.players
                .where("gameId").equals(gameId)
                .sortBy("index")
        }
        return [];
    }, [gameId]);

    const setting = useLiveQuery(() => {
        if (gameId) {
            return db.settings.get({gameId})
        }
        return undefined;
    });

    const getDefaultValues = (players: DbPlayer[] | undefined): Round => ({
        winnerPlayerId: "",
        dubleeWin: false,
        scores: players?.map(player => ({playerId: player.id, status: PlayerRoundStatus.UNSEEN})) || [],
    });

    const {handleSubmit, register, control, reset, formState: {errors}} = useForm<Round>({
        defaultValues: getDefaultValues(players)
    });

    useEffect(() => {
        reset(getDefaultValues(players));
    }, [players, reset])

    const {fields, update} = useFieldArray<Round>({control, name: "scores"});

    const onSubmit = async (round: Round) => {

        const roundId = generateId();
        const dbRound: DbRound = {
            id: roundId,
            createdAt: new Date(),
            gameId,
            index: 0,
            winnerPlayerId: round.winnerPlayerId,
            dubleeWin: round.dubleeWin,
        }

        const playerPoints = calculatePoints(round, setting!);
        const dbScores: DbScore[] = round.scores
            .map(p => ({
                roundId,
                playerId: p.playerId,
                gameId,
                maal: p.maal || 0,
                status: p.status,
                point: playerPoints[p.playerId] ?? 0,
            }));

        await db.transaction("rw", db.rounds, db.scores, db.scores, async () => {
            await db.rounds.add(dbRound);
            await db.scores.bulkAdd(dbScores);
        });
        await router.push(`/${gameId}/scoreboard`);
    }

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <List
                subheader={<ListSubheader color="primary">Round #1</ListSubheader>}
            >
                <ListItem>
                    <ListItemText primary="Winner"/>
                    <FormControl size="small" sx={{width: 0.8}}>
                        <Controller
                            name="winnerPlayerId"
                            control={control}
                            render={({field}) =>
                                <Select
                                    {...field}
                                    displayEmpty
                                    {...register("winnerPlayerId", {required: true})}
                                    error={!!errors?.winnerPlayerId}
                                >
                                    <MenuItem value={""}>Select Winner</MenuItem>
                                    {
                                        players?.map(player =>
                                            <MenuItem
                                                key={player.id}
                                                value={player.id}>
                                                {player.name}
                                            </MenuItem>
                                        )
                                    }
                                </Select>
                            }
                        />
                    </FormControl>
                </ListItem>
                <ListItem>
                    <FormControl size="small" sx={{width: 0.8}}>
                        <Controller
                            name="dubleeWin"
                            control={control}
                            render={({field}) =>
                                <FormControlLabel
                                    control={<Switch {...field} />}
                                    labelPlacement="start"
                                    label="Dublee Win"/>
                            }/>
                    </FormControl>
                </ListItem>
                {
                    fields.map((field, index) =>

                        <ListItem
                            key={field.id}
                        >
                            <ListItemText
                                primary={players && players[index]?.name}
                                sx={{width: '10ch'}}
                            />
                            <Stack direction="row" spacing={2} sx={{width: 1}}>
                                <TextField
                                    inputProps={{style: {textAlign: "center"}}}
                                    sx={{width: '7ch', textAlign: 'center'}}
                                    variant="outlined"
                                    label="Maal"
                                    type="number"
                                    size="small"
                                    {...register(`scores.${index}.maal` as const, {min: 0, valueAsNumber: true})}
                                    error={!!(errors?.scores && errors.scores[index]?.maal)}
                                />
                                <FormControl size="small" sx={{width: 1 / 2}}>
                                    <Controller
                                        name={`scores.${index}.status` as const}
                                        control={control}
                                        render={({field}) =>
                                            <Select
                                                {...field}
                                                {...register(`scores.${index}.status` as const, {required: true})}
                                                error={!!(errors?.scores && errors.scores[index]?.status)}
                                            >
                                                {
                                                    Object.values(PlayerRoundStatus)
                                                        .map(status =>
                                                            <MenuItem
                                                                key={status}
                                                                value={status}>
                                                                {status}
                                                            </MenuItem>
                                                        )
                                                }
                                            </Select>
                                        }
                                    />
                                </FormControl>
                            </Stack>
                        </ListItem>
                    )
                }
            </List>

            <Stack direction="row" spacing={2}>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    Calculate
                </Button>
            </Stack>
        </Box>
    )
        ;
}