import {FC} from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Container} from "@mui/material";

export const NavBar: FC = () => (
    <Box sx={{flexGrow: 1}}>
        <AppBar position="fixed">
            <Container maxWidth="md" disableGutters>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6"
                                component="div"
                                sx={{
                                    flexGrow: 1,
                                    cursor: "pointer",
                                    caretColor: "transparent"
                                }}
                    >
                        Marriage
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
        <Toolbar/> {/* This Toolbar will occupy the space underneath the "fixed" Appbar and prevent the content to be hidden underneath Appbar. */}
    </Box>
);