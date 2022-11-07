import {Alert, Button, Collapse, ListItem, Snackbar, Stack, TextField} from "@mui/material";
import {FC, useState} from "react";
import Box from "@mui/material/Box";
import {TransitionGroup} from "react-transition-group";
import List from "@mui/material/List";
import IconButton from "@mui/material/IconButton";
import {Clear, Save} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import {useFieldArray, useForm} from "react-hook-form";
import {useRouter} from "next/router";
import ListSubheader from "@mui/material/ListSubheader";
import {db, generateId} from "./db";
import {LoadingButton} from "@mui/lab";
import {uniqBy} from "lodash";

type Player = {
    name?: String
}

type FormValues = {
    players: Player[];
}

export const Players: FC<{ gameId: string }> = ({gameId}) => {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

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
    const [errorMessage, setErrorMessage] = useState("");

    const handleErrorClose = () => {
        setShowError(false)
    };

    const onSubmit = async ({players}: FormValues) => {
        const validPlayers = players.filter(player => player.name?.trim().length);
        const hasDuplicateNames = uniqBy(validPlayers, p => p.name).length !== validPlayers.length;
        if (hasDuplicateNames) {
            setErrorMessage("Please enter unique names.");
            setShowError(true);
            return;
        }
        const valid = validPlayers.length >= 2;
        if (!valid) {
            setErrorMessage("Please enter at least 2 players.");
            setShowError(true);
            return;
        }

        const addedPlayers = validPlayers.map(({name}, index) => ({
            id: generateId(),
            gameId,
            index,
            name: name as string
        }));

        setSaving(true);
        await db.players.bulkAdd(addedPlayers);
        setSaving(false);
        await router.push(`/scores?gameId=${gameId}`);
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
                                        tabIndex={-1}
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
                                    inputProps={{
                                        maxLength: 10,
                                        style: {
                                            textAlign: "left"
                                        }
                                    }}
                                    sx={{
                                        width: '14ch',
                                        textAlign: 'left'
                                    }}
                                    variant="outlined"
                                    size="small"
                                    {...register(`players.${index}.name` as const, {maxLength: 10})}
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
                <LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    loading={saving}
                    loadingPosition="start"
                    startIcon={<Save/>}
                    color="primary"
                >
                    Start
                </LoadingButton>
            </Stack>
            <Snackbar open={showError}
                      anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                      }}
                      autoHideDuration={2000} onClose={handleErrorClose}>
                <Alert onClose={handleErrorClose} severity="error" sx={{width: '100%'}}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};