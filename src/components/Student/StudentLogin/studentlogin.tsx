
import { Button, Flex, Input, Text, Img } from '@chakra-ui/react';
import React, { useState } from 'react';

import styles from './studentlogin.module.css'

const StudentLogin: React.FC = () => {
    const [loginForm, setLoginForm] = useState({
        usn: "",
        password: "",
        role: "student"
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
        console.log(loginForm);
    }




    return (
        <div className='main-container'>
            <Img src='/images/img_avatar2.png' className='avatar' />
            <form onSubmit={onSubmit}>
                <Input required
                    name='usn'
                    placeholder='Enter your USN'
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
                    className={styles.loginbutton}
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
export default StudentLogin;