import { useContext, useCallback } from "react";
import VideoContext from "../Video.context";
import { VideoActionTypes } from "../Video.reducer";

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideoContext must be used within a VideoProvider");
  }

  const { state, dispatch, videoURL, autoPlay } = context;

  const setVideoRef = useCallback(
    (ref: React.RefObject<HTMLVideoElement>) => {
      dispatch({ type: VideoActionTypes.SET_REF, payload: ref });
    },
    [dispatch],
  );

  const playVideo = useCallback(async () => {
    if (state.videoRef.current) {
      await state.videoRef.current.play();
      dispatch({ type: VideoActionTypes.PLAY });
    }
  }, [state.videoRef, dispatch]);

  const pauseVideo = useCallback(async () => {
    if (state.videoRef.current) {
      state.videoRef.current.pause();
      dispatch({ type: VideoActionTypes.PAUSE });
    }
  }, [state.videoRef, dispatch]);

  const restartVideo = useCallback(async () => {
    if (state.videoRef.current) {
      state.videoRef.current.currentTime = 0;
      await playVideo();
    }
  }, [state.videoRef, playVideo]);

  const seekVideo = useCallback(
    (time: number) => {
      if (state.videoRef.current) {
        state.videoRef.current.currentTime = time;
        dispatch({ type: VideoActionTypes.UPDATE_TIME, payload: time });
      }
    },
    [state.videoRef, dispatch],
  );

  const toggleMute = useCallback(() => {
    if (state.videoRef.current) {
      state.videoRef.current.muted = !state.videoRef.current.muted;
    }
    dispatch({ type: VideoActionTypes.TOGGLE_MUTE });
  }, [state.videoRef, dispatch]);

  const setUrl = useCallback(
    (url: string) => {
      dispatch({ type: VideoActionTypes.SET_VIDEO_URL, payload: url });
    },
    [dispatch]
  );

  return {
    state,
    videoURL,
    autoPlay,
    setVideoRef,
    playVideo,
    pauseVideo,
    restartVideo,
    seekVideo,
    toggleMute,
    setUrl,
  };
};
