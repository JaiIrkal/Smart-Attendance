import React, { useContext } from "react"
import { ChevronDownIcon } from '@chakra-ui/icons';
import { VscAccount } from "react-icons/vsc"
import { Flex, Icon, Menu, MenuButton, MenuDivider, MenuItem, MenuList } from "@chakra-ui/react";
import KeyIcon from '@mui/icons-material/Key';
import LogoutIcon from '@mui/icons-material/Logout';
import { blue } from "@mui/material/colors";
import AuthContext from "../../../context/AuthProvider";
import useLogout from "../../../hooks/useLogout";
import { useNavigate } from "react-router-dom";

const RightContent: React.FC = () => {

    const navigate = useNavigate();

    const logout = useLogout();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    }

    return (
        <Flex width={"fit-content"}>
            <Menu  >
                <MenuButton
                    cursor={"pointer"}
                    padding="0px 6px"
                    borderRadius={4}
                    _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
                >
                    <Flex align='center' fontSize={'2xl'} fontWeight='bold'>
                        <Icon as={VscAccount}
                            color="gray.500"
                            mb={1}
                            fontSize={24} />
                        Account
                        <ChevronDownIcon />
                    </Flex>
                </MenuButton>
                <MenuList outline='solid' outlineOffset={'5'} borderRadius={15} padding={'10px'}>
                    <MenuItem
                        fontSize={"10pt"}
                        fontWeight={700}

                        _hover={{ bg: "blue.500", color: "#009FBD" }}>
                        <Flex align='center' bg={blue}>
                            <Icon as={KeyIcon} fontSize={'1xl'} mr={'4px'}></Icon>
                            Change Password
                        </Flex>
                    </MenuItem>
                    <MenuDivider mt={'5px'} mb={'5px'} />
                    <MenuItem
                        fontSize={"10pt"}
                        fontWeight={700}

                        _hover={{ bg: "blue.500", color: "#009FBD" }}>
                        <Flex align='center' bg={blue} onClick={() => { handleLogout() }}>
                            <Icon as={LogoutIcon} fontSize={'1xl'} mr={'4px'}></Icon>
                            Log Out
                        </Flex>
                    </MenuItem>
                </MenuList>
            </Menu>
        </Flex>

    )
}

export default RightContent;