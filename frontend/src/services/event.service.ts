import {useMutation, useQuery} from "@tanstack/react-query";
import {useRef} from "react";
import Api from "./api.ts";
import {Event} from "../@types/Event.ts";

export function useEvent(id: number){
    const api = useRef(new Api());

    return useQuery({
        queryKey: ["event"],
        queryFn: async () => {
            return await api.current.get<Event>(`/event/${id}`);
        },
        select: ({data}:any) => data.event as Event,
        refetchInterval: 1000,
    });
}

export function useClassifyVideoStrokeTypeMutation(onSuccess?: (data: any) => void) {
    const api = useRef(new Api());
    return useMutation({
        mutationFn: async (values: { stroke_type: number, event_id: number}[]) => {
            const response = await api.current.put(`/events/stroke-types`, values);
            return response.data;
        },

        onSuccess: (data) => {
            onSuccess?.(data)
        },

    })
}
    