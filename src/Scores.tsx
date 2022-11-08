import {FC, useEffect, useState} from "react";
import {GameIdProp} from "./GameIdProp";
import {db, DbRound, DbScore, generateId} from "./db";
import Box from "@mui/material/Box";
import {FormControl, FormControlLabel, ListItem, MenuItem, Select, Stack, TextField, Tooltip} from "@mui/material";
import ListSubheader from "@mui/material/ListSubheader";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Switch from '@mui/material/Switch';
import {calculatePoints, PlayerStatus} from "./calculatePoints";
import {useRouter} from "next/router";
import {usePlayers} from "./usePlayers";
import {useSettings} from "./useSettings";
import {useRounds} from "./useRounds";
import {head, sumBy} from "lodash";
import {Loading} from "./Loading";
import {LoadingButton} from "@mui/lab";
import {Calculate} from "@mui/icons-material";
import {useRoundScores} from "./useScores";
import Typography from "@mui/material/Typography";

export enum PlayerRoundStatus {
    UNSEEN = "Unseen",
    SEEN = "Seen",
    FOUL = "Foul",
    PAUSE = "Pause",
}

type RoundScore = {
    playerId: string,
    maal?: number,
    status: PlayerRoundStatus,
};

export interface Round {
    winnerPlayerId: string;
    dubleeWin: boolean;
    scores: RoundScore[]
}

type ScoresProps = GameIdProp & {
    roundId?: string
};

export const Scores: FC<ScoresProps> = ({gameId, roundId}) => {
    const router = useRouter();
    const players = usePlayers(gameId);
    const settings = useSettings(gameId);
    const rounds = useRounds(gameId);
    const round = rounds?.find(r => r.id === roundId);
    const roundScores = useRoundScores(roundId)
    const prevRound = round ? rounds?.find(r => r.createdAt < round.createdAt) : head(rounds);
    const prevRoundScores = useRoundScores(prevRound?.id);
    const [saving, setSaving] = useState(false);
    const [disableDubleeWin, setDisableDubleeWin] = useState(true);
    const readOnly = !!round;

    const playerIndex: Record<string, number> =
        Object.fromEntries(players?.map(p => [p.id, p.index]) ?? []);

    const prevRoundPlayerStatus: PlayerStatus =
        Object.fromEntries(prevRoundScores?.map(s => [s.playerId, s.status]) ?? []);

    const getDefaultScores = (): RoundScore[] => {
        if (round && roundScores) {
            return roundScores.map(score => ({playerId: score.playerId, maal: score.maal, status: score.status}))
                .sort((s1, s2) => playerIndex[s1.playerId] - playerIndex[s2.playerId]);
        }
        return players?.map(player => {
            const pause = prevRoundPlayerStatus[player.id] === PlayerRoundStatus.PAUSE;
            return {
                playerId: player.id,
                maal: pause ? 0 : undefined,
                status: pause ? PlayerRoundStatus.PAUSE : PlayerRoundStatus.UNSEEN
            };
        }) ?? [];
    }
    const getDefaultValues = (): Round => ({
        winnerPlayerId: round?.winnerPlayerId || "",
        dubleeWin: round?.dubleeWin || false,
        scores: getDefaultScores(),
    });

    const {handleSubmit, register, control, reset, setValue, getValues, formState: {errors}} =
        useForm<Round>({
            defaultValues: getDefaultValues()
        });

    const {fields, update} = useFieldArray<Round>({control, name: "scores"});

    useEffect(() => {
        reset(getDefaultValues());
    }, [players, round, roundScores, prevRoundScores])

    useEffect(() => {
        const noOfActivePlayers = sumBy(fields, f => f.status !== PlayerRoundStatus.PAUSE ? 1 : 0);
        const disableDublee = noOfActivePlayers < 4;
        setDisableDubleeWin(disableDublee);
        if (disableDublee) {
            setValue("dubleeWin", false);
        }
    }, [fields])

    if (!players || !settings || !rounds) {
        return <Loading/>;
    }

    const getPlayerStatusInRound = async (round: DbRound | undefined): Promise<PlayerStatus> => {
        if (round) {
            const prevScores = await db.scores.where("roundId").equals(round.id).toArray();
            return Object.fromEntries(prevScores.map(s => [s.playerId, s.status]));
        }
        return {};
    }

    const onSubmit = async (round: Round) => {
        setSaving(true);
        const roundId = generateId();
        const dbRound: DbRound = {
            id: roundId,
            createdAt: new Date(),
            gameId,
            index: 0,
            winnerPlayerId: round.winnerPlayerId,
            dubleeWin: round.dubleeWin,
        }

        const playerStatusInPrevRound = await getPlayerStatusInRound(prevRound);
        const playerPoints = calculatePoints(round, settings, playerStatusInPrevRound);
        const dbScores: DbScore[] = round.scores
            .map(p => ({
                roundId,
                playerId: p.playerId,
                gameId,
                maal: p.maal || 0,
                status: p.status,
                point: playerPoints[p.playerId] ?? 0,
            }));

        await db.transaction("rw", db.rounds, db.scores, async () => {
            await db.rounds.add(dbRound);
            await db.scores.bulkAdd(dbScores);
        });
        setSaving(false);
        await router.push(`/scoreboard?gameId=${gameId}`);
    };

    const changeStatusToSeen = (index: number) => {
        setValue(`scores.${index}.status`, PlayerRoundStatus.SEEN);
    }
    const onSelectWinner = (playerId: string) => {
        if (playerId) {
            const index = fields.findIndex(f => f.playerId === playerId);
            changeStatusToSeen(index);
        }
    }

    const onStatusChange = (index: number, status: PlayerRoundStatus) => {
        const playerId = fields[index].playerId;
        if (status !== PlayerRoundStatus.SEEN) {
            update(index, {maal: 0, status, playerId})
        }

        if (![PlayerRoundStatus.SEEN, PlayerRoundStatus.FOUL].includes(status)) {
            if (getValues("winnerPlayerId") === playerId) {
                setValue("winnerPlayerId", "");
            }
        }
    }

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <List
                subheader={<ListSubheader color="primary">Round #{rounds.length + 1}</ListSubheader>}
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
                                    onChange={(event) => {
                                        field.onChange(event);
                                        const playerId = event.target.value;
                                        onSelectWinner(playerId);
                                    }}
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
                                    control={
                                        <Switch
                                            checked={field.value}
                                            onChange={field.onChange}
                                        />
                                    }
                                    disabled={disableDubleeWin}
                                    labelPlacement="start"
                                    label={
                                        <Tooltip title="Applicable for 4 or more players" arrow>
                                            <Typography>
                                                Dublee Win
                                            </Typography>
                                        </Tooltip>
                                    }
                                />
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
                                <Controller
                                    name={`scores.${index}.maal` as const}
                                    control={control}
                                    render={({field}) =>
                                        <TextField
                                            inputProps={{style: {textAlign: "center"}}}
                                            sx={{width: '9ch', textAlign: 'center'}}
                                            variant="outlined"
                                            label="Maal"
                                            type="number"
                                            size="small"
                                            required
                                            {...register(`scores.${index}.maal` as const, {min: 0, valueAsNumber: true, required: true})}
                                            onChange={(event) => {
                                                field.onChange(event);
                                                const {value} = event.target;
                                                if (parseInt(value) > 0) {
                                                    changeStatusToSeen(index);
                                                }
                                            }}
                                            error={!!(errors?.scores && errors.scores[index]?.maal)}
                                        />
                                    }
                                />
                                <FormControl size="small" sx={{width: 1 / 2}}>
                                    <Controller
                                        name={`scores.${index}.status` as const}
                                        control={control}
                                        render={({field}) =>
                                            <Select
                                                {...field}
                                                {...register(`scores.${index}.status` as const, {required: true})}
                                                onChange={(event) => {
                                                    field.onChange(event);
                                                    const status = event.target.value;
                                                    onStatusChange(index, status as PlayerRoundStatus);
                                                }}
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
                <LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    loading={saving}
                    loadingPosition="start"
                    startIcon={<Calculate/>}
                >
                    Calculate
                </LoadingButton>
            </Stack>
        </Box>
    );
}