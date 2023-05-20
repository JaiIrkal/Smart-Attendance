import React from "react"
import { Box, Button, Menu, MenuItem } from "@mui/material";
import useLogout from "../../../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import AccountCircle from '@mui/icons-material/AccountCircle';

import styles from "./RightContent.module.css"

const RightContent: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);



    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const navigate = useNavigate();

    const logout = useLogout();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    }

    return (
        <Box className={styles["Navbar-Right-Content"]}>

            <Button
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"

            >
                <AccountCircle />
            </Button>
            <Menu
                sx={{ mt: '18px' }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                    handleClose();
                    handleLogout();
                }}>Log Out</MenuItem>
            </Menu>
        </Box>

    )
}

export default RightContent;