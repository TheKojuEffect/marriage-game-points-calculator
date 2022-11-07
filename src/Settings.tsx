import {Box, Button, Stack, TextField} from "@mui/material";
import {FC, useRef} from "react";
import {useForm} from "react-hook-form";
import {useRouter} from "next/router";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import {startCase} from "lodash";
import {db} from "./db";
import {GameIdProp} from "./GameIdProp";
import {LoadingButton} from "@mui/lab";
import {Save} from "@mui/icons-material";

export interface GameSettings {
    pointRate: number;
    seenPoint: number;
    unseenPoint: number;
    foulPoint: number;
    dubleeWinBonusPoint: number;
}

export const defaultGameSettings: GameSettings = {
    pointRate: 1,
    seenPoint: 3,
    unseenPoint: 10,
    dubleeWinBonusPoint: 5,
    foulPoint: 15,
} as const;

export const Settings: FC<GameIdProp> = ({gameId}) => {
    const router = useRouter();
    const saving = useRef(false);
    const {register, handleSubmit, control, formState: {errors}} = useForm<GameSettings>({
        defaultValues: defaultGameSettings
    });

    const onSubmit = async (data: GameSettings) => {
        saving.current = true
        await db.settings.add({
            gameId,
            ...data
        })
        saving.current = false
        await router.push(`/players?gameId=${gameId}`);
    };

    return (
        <Box>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
                <List
                    subheader={
                        <ListSubheader color="primary">
                            New Game Settings
                        </ListSubheader>
                    }
                >
                    {
                        (Object.keys(defaultGameSettings) as (keyof GameSettings)[])
                            .map(setting =>
                                <ListItem key={setting}>
                                    <ListItemText primary={startCase(setting)}/>
                                    <TextField
                                        inputProps={{style: {textAlign: "center"}}}
                                        sx={{width: '7ch', textAlign: 'center'}}
                                        variant="outlined"
                                        required
                                        type="number"
                                        size="small"
                                        {...register(setting, {required: true, min: 0, valueAsNumber: true})}
                                        error={!!errors[setting]}
                                    />
                                </ListItem>
                            )
                    }
                </List>

                <Stack direction="row" spacing={2}>
                    <Button
                        type="reset"
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={router.back}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        loading={saving.current}
                        loadingPosition="start"
                        startIcon={<Save />}
                        color="primary"
                    >
                        Save
                    </LoadingButton>
                </Stack>
            </Box>
        </Box>
    );
};