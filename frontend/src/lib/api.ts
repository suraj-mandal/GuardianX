import {UserEmailLoginDto, UserPhoneLoginDto, UserRegistrationDto} from "../models/user-dto.ts";
import axios from "axios";


async function performLoginByPhone(phoneNumber: string, password: string) {
    const loginRequest = new UserPhoneLoginDto(phoneNumber, password);
    return axios.post('/api/auth/login/phone', loginRequest);
}

async function performLoginByEmail(email: string, password: string) {
    const loginRequest = new UserEmailLoginDto(email, password);
    return axios.post('/api/auth/login/email', loginRequest);
}

function performRegistration(fullName: string, email: string, phoneNumber: string, password: string) {
    const registrationRequest = new UserRegistrationDto(fullName, email, phoneNumber, password);
    return axios.post('/api/auth/register', registrationRequest);
}

export {performLoginByPhone, performRegistration, performLoginByEmail};