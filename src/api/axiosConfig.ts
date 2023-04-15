import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        "ngrok-skip-browser-warning": "true",
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Methods': '*',
    }
});
