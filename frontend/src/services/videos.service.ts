import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
import Api from "./api.ts";
import { Video } from "../@types/video.ts";
import { VideoEventQueryResponse } from "@/@types/VideoEvent.ts";

export function useGetVideosQuery() {
  const api = useRef(new Api());

  return useQuery({
    queryKey: ["get-videos"],
    refetchInterval: 3000,
    queryFn: async () => {
      const { data } = await api.current.get<{ videos: Video[] }>(`/videos/`);
      return data;
    },
  });
}
export const useDeleteVideoMutation = () => {
  const api = useRef(new Api());

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId: number) => api.current.delete(`/videos/${videoId}`),
    onSuccess: () => {
      // Invalidate the video list query to refresh the table data
      queryClient.invalidateQueries({ queryKey: ["get-videos"] });
    },
    onError: (error: any) => {
      console.error("Failed to delete video:", error);
    },
  });
};

export const useGetVideoWithEventsQuery = (videoId?: string) => {
  const api = useRef(new Api());

  return useQuery<VideoEventQueryResponse>({
    queryKey: ["get-video-json", videoId],
    queryFn: () => api.current.get(`/videos/${videoId}`),
    enabled: !!videoId, 
  });
};

export const useStreamVideoQuery = (videoId?: string) => {
  // Instead of creating a Blob URL, we can directly use the stream URL
  const streamUrl = `/api/videos/stream/${videoId}`;

  return {
    streamUrl,
    isLoading: false,
    error: null
  };
};


