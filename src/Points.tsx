import {FC, useEffect} from "react";
import {GameIdProp} from "./GameIdProp";
import {useLiveQuery} from "dexie-react-hooks";
import {db, Player} from "./db";
import Box from "@mui/material/Box";
import {Button, FormControl, InputLabel, ListItem, MenuItem, Select, Stack, TextField} from "@mui/material";
import ListSubheader from "@mui/material/ListSubheader";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";

enum PlayerRoundStatus {
    UNSEEN = "Unseen",
    SEEN = "Seen",
    FOUL = "Foul",
    FOLD = "Fold",
}

type FormValues = {
    winnerPlayerId: string
    points: {
        playerId: string,
        maal?: number,
        status: PlayerRoundStatus,
    }[]
}

export const Points: FC<GameIdProp> = ({gameId}) => {
    const players = useLiveQuery(() => {
        if (gameId) {
            return db.players
                .where("gameId").equals(gameId)
                .toArray()
            // .sortBy("index")
        }
        return [];
    }, [gameId]);

    const getDefaultValues = (players: Player[] | undefined): FormValues => ({
        winnerPlayerId: "",
        points: players?.map(player => ({playerId: player.id, status: PlayerRoundStatus.UNSEEN})) || [],
    });

    const {handleSubmit, register, control, reset, formState: {errors}} = useForm<FormValues>({
        defaultValues: getDefaultValues(players)
    });

    useEffect(() => {
        reset(getDefaultValues(players));
    }, [players])

    const {fields, update} = useFieldArray<FormValues>({control, name: "points"});

    const onSubmit = (values: FormValues) => {
        console.log({values});
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
                                <FormControl size="small" sx={{width: 1 / 2}}>
                                    <Controller
                                        name={`points.${index}.status` as const}
                                        control={control}
                                        render={({field}) =>
                                            <Select
                                                {...field}
                                                {...register(`points.${index}.status` as const, {required: true})}
                                                error={!!(errors?.points && errors.points[index]?.status)}
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
                                <TextField
                                    inputProps={{style: {textAlign: "center"}}}
                                    sx={{width: '7ch', textAlign: 'center'}}
                                    variant="outlined"
                                    label="Maal"
                                    type="number"
                                    size="small"
                                    {...register(`points.${index}.maal` as const, {min: 0, valueAsNumber: true})}
                                    error={!!(errors?.points && errors.points[index]?.maal)}
                                />
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
    );
}