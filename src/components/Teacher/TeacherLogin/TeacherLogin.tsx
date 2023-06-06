import { Button, Box, Input, Typography as Text } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../../../context/AuthProvider";
import api from "../../../api/axiosConfig";
import TeacherLoginStyles from "./TeacherLogin.module.css";

const LOGIN_URL = "/login";

const TeacherLogin: React.FC = () => {
    const [loginForm, setLoginForm] = useState({
        userid: "",
        password: "",
        role: "teacher",
    });

    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/teacher";
    const userRef = useRef<HTMLElement>();
    const errRef = useRef<HTMLElement>();

    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        if (userRef.current) {
            userRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [loginForm]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(loginForm);
        await api
            .post(LOGIN_URL, loginForm, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            })
            .then((response) => {
                setAuth({
                    userid: loginForm.userid,
                    role: loginForm.role,
                    accesstoken: response.data?.access_token,
                });
                setLoginForm({
                    userid: "",
                    password: "",
                    role: "teacher",
                });
                navigate(from, { replace: true });
            })
            .catch((error) => {
                // console.log(error)
                if (!error.response) {
                    setErrMsg("No Server Response");
                } else if (error.response?.status === 401) {
                    setErrMsg("Invalid UserId or Password");
                } else {
                    setErrMsg("Login Failed");
                }
            })
            .then(() => {
                errRef?.current?.focus();
            });
    };

    return (
        <div className={TeacherLoginStyles["main-container"]}>
            <img
                src="/images/teacher_avatar.jpeg"
                className="avatar"
                alt="teacheer avatar"
            />
            <form onSubmit={onSubmit}>
                <Input
                    required
                    name="userid"
                    placeholder="Enter your Login ID"
                    type="text"
                    onChange={onChange}
                />
                <Input
                    required
                    name="password"
                    placeholder="Enter Password"
                    type="password"
                    onChange={onChange}
                />
                <Text textAlign={"center"} color="red" fontSize={"10pt"}>
                    { }
                </Text>
                <Button type="submit" className={TeacherLoginStyles["login-button"]}>

                    Log In
                </Button>

            </form>
        </div>
    );
};
export default TeacherLogin;
