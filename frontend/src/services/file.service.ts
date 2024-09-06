import {useMutation} from "@tanstack/react-query";
import {useRef} from "react";
import Api from "./api.ts";

export function useUploadFileMutation(onSuccess?: (data: any) => void) {
    const api = useRef(new Api());
    return useMutation({
        mutationKey: ["uploadFile"],
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            const response = await api.current.post('/file/', formData);

            return response.data;
        },

        onSuccess: (data) => {
            console.log(data);
            onSuccess?.(data)
        }
    })
}