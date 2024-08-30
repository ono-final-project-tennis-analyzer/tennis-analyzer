import {useRef} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import Api from "./api.ts";
import {User} from "../@types/User.ts";


export const useMeQuery = () => {
    const api = useRef(new Api());

    return useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const response = await api.current.get<User>("/accounts/@me");
            return response;
        },
        // @ts-ignore
        select: ({data}) => data.user as User,
        retry: false,
    });
};

export const useLoginMutation = (onSuccess?: VoidFunction) => {
    const api = useRef(new Api());

    return useMutation({
        mutationKey: ["login"],
        // @ts-ignore
        mutationFn: async ({username, password}) => {
            const response = await api.current.post("/accounts/login", {
                username,
                password,
            });
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


export const useRegisterMutation = () => {
    const api = useRef(new Api());


    return useMutation({
        mutationKey: ["register"],
        // @ts-ignore
        mutationFn: async ({email, username, password}) => {
            return api.current.post("/accounts/", {
                email,
                username,
                password,
            });
        },
    });

}

