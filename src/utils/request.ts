import axios from 'axios';

const BASE_URL = "https://jsonplaceholder.typicode.com"

export const request = axios.create({
    baseURL: BASE_URL,
    timeout: 3000
})