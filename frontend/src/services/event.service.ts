import {useQuery} from "@tanstack/react-query";
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
        select: ({data}) => data.event as Event,
        refetchInterval: 1000,
    });
}
