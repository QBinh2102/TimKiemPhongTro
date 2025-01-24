import axios from "axios";

const BASE_URL = "https://toquocbinh2102.pythonanywhere.com/";

export const endpoints = {
    'baidangs': '/baidangs/',
    'login': '/o/token/',
    'current-user': '/users/current-user/', 
    'register': '/users/',
    'userDetail': '/users/',
}

export const authApis = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'application/json', 
        }
    });
}

export default axios.create({
    baseURL: BASE_URL
});
