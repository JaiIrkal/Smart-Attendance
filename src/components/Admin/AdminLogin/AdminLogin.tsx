
import { Button, Flex, Input, Text, Img } from '@chakra-ui/react';
import React, { useState } from 'react';

import './AdminLogin.css'

const AdminLogin: React.FC = () => {
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
        role: "admin"
    });

    //firebase logic

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //update form state

        setLoginForm((prev) => ({
            ...prev, [event.target.name]: event.target.value,
        }));
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(loginForm.email, loginForm.password);
    }




    return (
        <div className='main-container'>
            <Img src='/images/admin-avatar.webp' className='avatar' />
            <form onSubmit={onSubmit}>
                <Input required
                    name='LoginID'
                    placeholder='Enter your Login ID'
                    type='text'
                    mb={2}
                    mt={2}
                    onChange={onChange}
                    fontSize='10pt'
                    _placeholder={{ color: "gray.500" }}
                    _hover={{
                        bg: "white",
                        border: "1px solid",
                        borderColor: "blue.500"
                    }}
                    _focus={{
                        outline: "none",
                        bg: "white",
                        border: "1px solid",
                        borderColor: "blue.500"
                    }}
                />
                <Input
                    required
                    name='password'
                    placeholder='Enter Password'
                    type='password'
                    mb={2}
                    onChange={onChange} fontSize='10pt'
                    _placeholder={{ color: "gray.500" }}
                    _hover={{
                        bg: "white",
                        border: "1px solid",
                        borderColor: "blue.500"
                    }}
                    _focus={{
                        outline: "none",
                        bg: "white",
                        border: "1px solid",
                        borderColor: "blue.500"
                    }}
                />
                <Text textAlign={"center"} color="red" fontSize={"10pt"}> { }</Text>
                <Button width="100%" height="36px"
                    mt={2} mb={2}
                    type="submit" isLoading={Boolean("")}
                    loadingText='Loading'
                    colorScheme='teal'
                    variant='outline'
                    spinnerPlacement='start'
                    bgColor={"#569DAA"}
                    borderRadius="15"
                > Log In</Button>
                <Flex justifyContent="center" mb={1}>
                    <Text fontSize="9pt" mr={1}>
                        Forgot your password?
                    </Text>
                </Flex>

            </form >
        </div>

    );
}
export default AdminLogin;