import {useQuery} from "@tanstack/react-query";
import {useRef} from "react";
import Api from "./api.ts";
import {Video} from "../@types/video.ts";


export function useGetVideosQuery(){
    const api = useRef(new Api());

    return useQuery({
        queryKey: ["get-videos"],
        queryFn: async () => {
            return await api.current.get<{
                videos: Video[];
                count: number;
            }>(`/videos/`);
        },
    });
}


