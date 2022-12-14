import {FC, useCallback, useEffect, useState} from "react";
import {GameIdProp} from "./GameIdProp";
import {db, DbRound, DbScore} from "./db";
import Box from "@mui/material/Box";
import {
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    Input,
    InputAdornment,
    ListItem, ListItemButton,
    ListItemIcon,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip
} from "@mui/material";
import ListSubheader from "@mui/material/ListSubheader";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Switch from '@mui/material/Switch';
import {calculatePoints, PlayerStatus} from "./calculatePoints";
import {useRouter} from "next/router";
import {findIndex, head, sumBy} from "lodash";
import {Loading} from "./Loading";
import {LoadingButton} from "@mui/lab";
import {Calculate, ContentCopy, ContentCopyTwoTone, EmojiEvents, Error, Pause, PersonAdd, Visibility, VisibilityOff} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import {usePlayers, useRounds, useRoundScores, useSettings} from "./useDb";
import {generateId} from "./utils";
import IconButton from "@mui/material/IconButton";

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
    roundId: string | undefined
};

const statusIcons = {
    [PlayerRoundStatus.UNSEEN]: <VisibilityOff fontSize="small" color="inherit"/>,
    [PlayerRoundStatus.SEEN]: <Visibility fontSize="small" color="success"/>,
    [PlayerRoundStatus.FOUL]: <Error fontSize="small" color="error"/>,
    [PlayerRoundStatus.PAUSE]: <Pause fontSize="small" color="disabled"/>,
}

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

    const getDefaultScores = useCallback((): RoundScore[] => {
        const playerIndex: Record<string, number> =
            Object.fromEntries(players?.map(p => [p.id, p.index]) ?? []);

        const prevRoundPlayerStatus: PlayerStatus =
            Object.fromEntries(prevRoundScores?.map(s => [s.playerId, s.status]) ?? []);

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
    }, [round, roundScores, players, prevRoundScores]);

    const getDefaultValues = useCallback((): Round => ({
        winnerPlayerId: round?.winnerPlayerId || "",
        dubleeWin: round?.dubleeWin || false,
        scores: getDefaultScores(),
    }), [round, getDefaultScores]);

    const {handleSubmit, register, control, reset, setValue, getValues, watch, formState: {errors}} =
        useForm<Round>({
            defaultValues: getDefaultValues()
        });

    const {fields, update} = useFieldArray<Round>({control, name: "scores"});

    const updateDubleeWinStatus = useCallback(() => {
        const playerStatuses = getValues("scores").map(s => s.status);
        const noOfActivePlayers = sumBy(playerStatuses, status => status !== PlayerRoundStatus.PAUSE ? 1 : 0);
        const disableDublee = noOfActivePlayers < 4;
        setDisableDubleeWin(disableDublee);
        if (disableDublee) {
            setValue("dubleeWin", false);
        }
    }, [getValues, setValue, setDisableDubleeWin]);

    useEffect(() => {
        reset(getDefaultValues());
    }, [getDefaultValues, reset])

    useEffect(() => {
        updateDubleeWinStatus();
    }, [fields, updateDubleeWinStatus])

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
        await router.push(`/scoreboard?gameId=${gameId}`);
        setSaving(false);
    };

    const changeStatusToSeen = (index: number) => {
        setValue(`scores.${index}.status`, PlayerRoundStatus.SEEN);
        updateDubleeWinStatus()
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

    const roundNum = round ?
        rounds.length - findIndex(rounds, r => r.id === round.id)
        : rounds.length + 1

    const roundDateTime = round ? `played on ${round.createdAt.toLocaleString()}` : ''

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <List
                subheader={<ListSubheader color="primary">
                    Round #{roundNum} {roundDateTime}
                </ListSubheader>}
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
                                    readOnly={readOnly}
                                    variant={readOnly ? "filled" : "outlined"}
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
                    <Link href={`/players?gameId=${gameId}`} legacyBehavior>
                        <Button
                            type="button"
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<PersonAdd/>}
                            sx={{width: 200}}
                        >
                            Add Players
                        </Button>
                    </Link>
                    <FormControl size="small" sx={{width: 0.8}}>
                        <Controller
                            name="dubleeWin"
                            control={control}
                            render={({field}) =>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            readOnly={readOnly}
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
                            disableGutters
                        >
                            <Grid container alignItems="center" justifyContent="center">
                                <Grid item xs={2}>
                                    <ListItemText
                                        primary={players && players[index]?.name}
                                        sx={{width: '10ch', textAlign: 'center'}}

                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            {
                                                players && players[index].id === watch("winnerPlayerId")
                                                &&
                                                <EmojiEvents color="success"/>
                                            }
                                        </ListItemIcon>
                                    </ListItemButton>
                                </Grid>
                                <Grid item xs={3}>
                                    <Controller
                                        name={`scores.${index}.maal` as const}
                                        control={control}
                                        render={({field}) =>
                                            <TextField
                                                inputProps={{style: {textAlign: "center"}}}
                                                sx={{width: '9ch', textAlign: 'center'}}
                                                label="Maal"
                                                type="number"
                                                size="small"
                                                required
                                                variant={readOnly ? "filled" : "outlined"}
                                                InputProps={{
                                                    readOnly,
                                                }}
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
                                </Grid>
                                <Grid item xs={5}>
                                    <FormControl size="small" sx={{px: 1}}>
                                        <Controller
                                            name={`scores.${index}.status` as const}
                                            control={control}
                                            render={({field}) =>
                                                <Select
                                                    fullWidth
                                                    {...field}
                                                    {...register(`scores.${index}.status` as const, {required: true})}
                                                    onChange={(event) => {
                                                        field.onChange(event);
                                                        const status = event.target.value;
                                                        onStatusChange(index, status as PlayerRoundStatus);
                                                    }}
                                                    readOnly={readOnly}
                                                    variant={readOnly ? "filled" : "outlined"}
                                                    error={!!(errors?.scores && errors.scores[index]?.status)}
                                                    renderValue={(status) =>
                                                        <Input
                                                            defaultValue={status}
                                                            size="small"
                                                            disableUnderline
                                                            fullWidth
                                                            startAdornment={
                                                                <InputAdornment position="start">
                                                                    <IconButton
                                                                        edge="start"
                                                                    >
                                                                        {statusIcons[status]}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            }
                                                        />
                                                    }
                                                >
                                                    {
                                                        Object.values(PlayerRoundStatus)
                                                            .map(status =>
                                                                <MenuItem
                                                                    key={status}
                                                                    value={status}
                                                                >
                                                                    <ListItemIcon>
                                                                        {statusIcons[status]}
                                                                    </ListItemIcon>
                                                                    <ListItemText>{status}</ListItemText>
                                                                </MenuItem>
                                                            )
                                                    }
                                                </Select>
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </ListItem>
                    )
                }
            </List>

            <Stack direction="row" spacing={2}>
                <Button
                    type="button"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={router.back}
                >
                    Back
                </Button>
                <LoadingButton
                    type="submit"
                    disabled={readOnly}
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