import {FC} from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Container} from "@mui/material";
import Link from "next/link";
import {AppIcon} from "./AppIcon";

export const NavBar: FC = () => (
    <Box sx={{flexGrow: 1}}>
        <AppBar position="fixed">
            <Container maxWidth="md" disableGutters>
                <Toolbar>
                    <Link href="/" legacyBehavior>
                        <Box>
                            <IconButton>
                                <AppIcon fontSize="large"/>
                            </IconButton>
                            <Typography variant="h6"
                                        component="a"
                                        sx={{
                                            flexGrow: 1,
                                            cursor: "pointer",
                                            caretColor: "transparent",
                                            textDecoration: "none",
                                        }}
                            >
                                Marriage
                            </Typography>
                        </Box>
                    </Link>
                </Toolbar>
            </Container>
        </AppBar>
        <Toolbar/> {/* This Toolbar will occupy the space underneath the "fixed" Appbar and prevent the content to be hidden underneath Appbar. */}
    </Box>
);
