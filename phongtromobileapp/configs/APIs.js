import axios from "axios";

const BASE_URL = "https://toquocbinh2102.pythonanywhere.com/";

export const endpoints = {
    'baidangs': '/baidangs/'
}

export default axios.create({
    baseURL: BASE_URL
});