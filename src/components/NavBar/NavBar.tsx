
import { Box, Typography as Text } from '@mui/material';
import React from 'react';
import AuthContext from '../../context/AuthProvider';
import RightContent from './RightContent/RightContent';
import { useContext } from "react"

import styles from './Navbar.module.css'

const Navbar: React.FC = () => {
    return (
        <Box className={styles["Navbar"]}>
            < Box className={styles["Left-Content"]} >
                <Text className={styles["Navbar-item"]}>Home</Text>
                <Text className={styles["Navbar-item"]}>About Us</Text>
            </ Box>
            < RightContent />
        </Box >
    );
};
export default Navbar;