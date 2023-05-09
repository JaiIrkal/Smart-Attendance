import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export default axios.create({
    baseURL: BASE_URL,
    headers: {
        "ngrok-skip-browser-warning": "true",
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': '*',
    }
});


export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/JSON'
    },
    withCredentials: true

});
