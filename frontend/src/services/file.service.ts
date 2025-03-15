import {useMutation} from "@tanstack/react-query";
import {useRef} from "react";
import Api from "./api.ts";

export function useUploadFileMutation(onSuccess?: (data: any) => void) {
    const api = useRef(new Api());
    return useMutation({
        mutationKey: ["uploadFile"],
        mutationFn: async (values: {bottom_player_account_id: number, top_player_account_id: number, video: File}) => {
            const formData = new FormData();
            formData.append("video", values.video);
            formData.append("bottom_player_account_id", values.bottom_player_account_id.toString());
            formData.append("top_player_account_id", values.top_player_account_id.toString());
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            };
            const response = await api.current.post('/file/', formData, config);

            return response.data;
        },

        onSuccess: (data) => {
            onSuccess?.(data)
        },

    })
}