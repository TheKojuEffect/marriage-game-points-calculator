import {Alert, Button, Collapse, ListItem, Snackbar, Stack, TextField} from "@mui/material";
import {FC, useState} from "react";
import Box from "@mui/material/Box";
import {TransitionGroup} from "react-transition-group";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import {Clear} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import {useFieldArray, useForm} from "react-hook-form";
import {useRouter} from "next/router";
import ListSubheader from "@mui/material/ListSubheader";
import {db} from "./db";
import {v4 as uuidV4} from 'uuid';

type Player = {
    name?: String
}

type FormValues = {
    players: Player[];
}

export const Players: FC<{ gameId: string }> = ({gameId}) => {
    const router = useRouter();

    const {register, control, handleSubmit, watch, formState: {errors}} = useForm<FormValues>({
        mode: "onBlur",
        defaultValues: {
            players: Array(6).fill({})
        }
    });

    const {fields, append, remove, update} = useFieldArray<FormValues>({
        control,
        name: "players"
    });

    const [showError, setShowError] = useState(false);

    const handleErrorClose = () => {
        setShowError(false)
    };

    const validate = (players: Player[]): boolean => {
        const validPlayers = players.filter(player => player.name?.trim().length);
        const valid = validPlayers.length >= 2;
        if (!valid) {
            setShowError(true);
        }
        return valid;
    };

    const onSubmit = async ({players}: FormValues) => {
        if (!validate(players)) {
            return;
        }

        const addedPlayers = players.map(({name}, index) => ({
            id: uuidV4(),
            gameId,
            index,
            name: name as string
        }));

        await db.players.bulkAdd(addedPlayers);
        await router.push(`/${gameId}/points`);
    }

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <List
                subheader={<ListSubheader color="primary">Players</ListSubheader>}
            >
                <TransitionGroup>
                    {fields.map((field, index) =>
                        <Collapse key={field.id}>
                            <ListItem
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        title="Delete"
                                        onClick={() => update(index, {})}
                                    >
                                        <Clear/>
                                    </IconButton>
                                }
                            >
                                <ListItemText primary={`Player ${index + 1}`}/>
                                <TextField
                                    inputProps={{style: {textAlign: "left"}}}
                                    sx={{width: '20ch', textAlign: 'left'}}
                                    variant="outlined"
                                    size="small"
                                    {...register(`players.${index}.name` as const,)}
                                    error={!!(errors?.players && errors.players[index]?.name)}
                                />
                            </ListItem>
                        </Collapse>
                    )}
                </TransitionGroup>
            </List>
            <Stack direction="row" spacing={2}>
                <Button
                    type="reset"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={router.back}
                >
                    Back
                </Button>
                <Button
                    type="button"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={() => append({})}
                >
                    Add
                </Button>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    Start
                </Button>
            </Stack>
            <Snackbar open={showError}
                      anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                      }}
                      autoHideDuration={2000} onClose={handleErrorClose}>
                <Alert onClose={handleErrorClose} severity="error" sx={{width: '100%'}}>
                    Please enter at least 2 players.
                </Alert>
            </Snackbar>
        </Box>
    );
};