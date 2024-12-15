const BASE_URL = 'http://192.168.1.55:8000/api';

export const API_ENDPOINTS = {
    SIGNUP: `${BASE_URL}/signup`,
    SIGNIN: `${BASE_URL}/signin`,
    UPDATE_PASSWORD: `${BASE_URL}/update-password`,
    GET_DEVICE: `${BASE_URL}/get-device`,
    GET_MONTHLY_ENERGY: `${BASE_URL}/get-monthlyenergy`,
    GET_ENERGY: `${BASE_URL}/get-energy`,
    ADD_DEVICE: `${BASE_URL}/add-device`, 
    FORGOT_PASSWORD: `${BASE_URL}/forgot-password`, 
};

export default BASE_URL;
