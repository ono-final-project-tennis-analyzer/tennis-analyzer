import React, { useReducer, useEffect } from 'react';
import VideoContext, { VideoContextType } from './Video.context';
import { defaultVideoState } from './Video.state';
import { videoReducer, VideoActionTypes } from './Video.reducer';

export interface VideoProviderProps extends React.PropsWithChildren {
  autoPlay?: boolean;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({
  autoPlay = true,
  children,
}) => {
  const [state, dispatch] = useReducer(videoReducer, defaultVideoState);

  useEffect(() => {
    const videoEl = state.videoRef.current;
    if (!videoEl) return;

    const handleTimeUpdate = () => {
      dispatch({ type: VideoActionTypes.UPDATE_TIME, payload: videoEl.currentTime });
    };

    const handlePlay = () => dispatch({ type: VideoActionTypes.PLAY });
    const handlePause = () => dispatch({ type: VideoActionTypes.PAUSE });
    const handleLoadedMetadata = () => {
      dispatch({ type: VideoActionTypes.SET_DURATION, payload: videoEl.duration });
    };

    videoEl.addEventListener('timeupdate', handleTimeUpdate);
    videoEl.addEventListener('play', handlePlay);
    videoEl.addEventListener('pause', handlePause);
    videoEl.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      videoEl.removeEventListener('play', handlePlay);
      videoEl.removeEventListener('pause', handlePause);
      videoEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [state.videoRef, dispatch]);

  const contextValue: VideoContextType = {
    state,
    dispatch,
    autoPlay,
  };

  return <VideoContext.Provider value={contextValue}>{children}</VideoContext.Provider>;
};
