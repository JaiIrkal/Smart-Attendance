
import { Button, Flex, Input, Text, Img } from '@chakra-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../../context/AuthProvider';
import api from '../../../api/axiosConfig'


import './AdminLogin.css'

const LOGIN_URL = '/login';

const AdminLogin: React.FC = () => {

    const [loginForm, setLoginForm] = useState({
        userid: "",
        password: "",
        role: "admin"
    });

    const { setAuth, auth } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/admin"
    const userRef = useRef<HTMLElement>();
    const errRef = useRef<HTMLElement>();

    const [errMsg, setErrMsg] = useState('');


    useEffect(() => {
        if (userRef.current) { userRef.current.focus(); }
    }, [])


    useEffect(() => {
        setErrMsg('')
    }, [loginForm])

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm((prev) => ({
            ...prev, [event.target.name]: event.target.value,
        }));
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(loginForm);
        await api.post(LOGIN_URL, loginForm, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }).then(
            (response) => {

                setAuth({ userid: loginForm.userid, role: loginForm.role, accesstoken: response.data?.access_token })
                setLoginForm({
                    userid: "",
                    password: "",
                    role: "admin"
                })
                console.log(auth)
                navigate(from, { replace: true });

            }
        ).catch(
            (error) => {
                // console.log(error)
                if (!error.response) {
                    setErrMsg('No Server Response');
                } else if (error.response?.status === 401) {
                    setErrMsg('Invalid UserId or Password')
                } else {
                    setErrMsg('Login Failed')
                }
            }
        ).then(() => { errRef?.current?.focus() });
    }

    return (
        <div className='main-container'>
            <Img src='/images/admin-avatar.webp' className='avatar' />
            <form onSubmit={onSubmit}>
                <Input required
                    name='userid'
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
                <Text textAlign={"center"} color="red" fontSize={"10pt"}> {errMsg}</Text>
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
            </form >
        </div>

    );
}
export default AdminLogin;