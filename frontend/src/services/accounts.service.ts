import {useRef} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import Api from "./api.ts";
import {IUserData, User} from "../@types/User.ts";


export const useMeQuery = () => {
    const api = useRef(new Api());

    return useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const response = await api.current.get("/accounts/@me");
            return response;
        },
        select: ({data}) => data.user as User,
        retry: false,
    });
};

export const useLoginMutation = (onSuccess?: VoidFunction) => {
    const api = useRef(new Api());

    return useMutation({
        mutationKey: ["login"],
        // @ts-ignore
        mutationFn: async (credentials: { email: string, password: String }) => {
            const response = await api.current.post("/accounts/login", credentials);
            return response.data;
        },
        onSuccess
    })
}

export const useLogoutMutation = (onSuccess?: VoidFunction) => {
    const api = useRef(new Api());

    return useMutation({
        mutationKey: ["logout"],
        mutationFn: async () => {
            return api.current.post("/accounts/logout");
        },
        onSuccess,
    })
}


export const useRegisterMutation = (onSuccess?: VoidFunction) => {
    const api = useRef(new Api());


    return useMutation({
        mutationKey: ["register"],

        mutationFn: async (credentials: { email: string, username: string, password: string }) => {
            return api.current.post("/accounts/", credentials);
        },
        onSuccess,
    });

}

export const useGetAccountQuery = () => {
    const api = useRef(new Api());

    return useQuery({
        queryKey: ["account-select-options"],
        queryFn: async () => {
            return await api.current.get(`/accounts/select-options`);
        },
        select: ({data}) => data.accounts as IUserData[],
        retry: false,
    });

};

