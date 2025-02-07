'use server'

import axios from "axios";
import { handleAxiosServerError } from "@/lib/fetcher";
import { VerifyLoginPayloadParams } from "thirdweb/auth";
import { cookies } from "next/headers";

export async function genPayload(params: { address: string, chainId: number }) {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_EDEN_API_URL}/v3/login`, { params });
        return response.data;
    } catch (error) {
        handleAxiosServerError(error);
    }
}

export const login = async (payload: VerifyLoginPayloadParams) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_EDEN_API_URL}/v3/login`, payload);
        const jwt = response.data.token;
        if (jwt) {
            cookies().set('jwt', jwt);
        }
        return response.data;
    } catch (error) {
        handleAxiosServerError(error);
    }
};

export const checkAuth = async () => {
    const jwt = cookies().get('jwt')?.value;
    if (!jwt) {
        return false;
    }
    const params = { jwt };
    const response = await axios.get(`${process.env.NEXT_PUBLIC_EDEN_API_URL}/v3/islogin`, { params });
    const res = response.data
    return res
};

export const logout = async () => {
    cookies().delete('jwt');
};