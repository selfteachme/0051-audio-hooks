import React, { useState, useRef, useEffect } from "react";

const useAudioPlayer = ({ audioPlayer, progressBar, animationRef }) => {
  // state
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeJump, setTimeJump] = useState(0);

  // flag for when ready
  useEffect(() => {
    setIsReady(Boolean(audioPlayer.current && progressBar.current));
  }, [audioPlayer.current, progressBar.current]);

  // handle time jumps
  useEffect(() => {
    if (!isReady) return;

    timeTravel(timeJump);
    setIsPlaying(true);
    play();
  }, [isReady, timeJump]);

  // grabs the loaded metadata
  useEffect(() => {
    if (!isReady) return;

    const seconds = Math.floor(audioPlayer.current.duration);
    // setDuration(seconds); // Do we want to expose this?
    progressBar.current.max = seconds;
  }, [
    isReady,
    audioPlayer?.current?.loadedmetadata,
    audioPlayer?.current?.readyState,
  ]);

  // when you get to the end
  useEffect(() => {
    // TODO: Add test for making sure this happens
    if (Number(duration) > 1 && Number(currentTime) === Number(duration)) {
      togglePlayPause();
      timeTravel(0);
    }
  }, [currentTime, duration]);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const play = () => {
    audioPlayer.current.play();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      play();
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer?.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  const backThirty = () => {
    timeTravel(Number(progressBar.current.value) - 30);
  };

  const forwardThirty = () => {
    timeTravel(Number(progressBar.current.value) + 30);
  };

  const timeTravel = (newTime) => {
    progressBar.current.value = newTime;
    changeRange();
  };

  return {
    isPlaying,
    duration,
    currentTime,
    calculateTime,
    togglePlayPause,
    changeRange,
    backThirty,
    forwardThirty,
    timeTravel,
    setTimeJump,
    play,
  };
};

export { useAudioPlayer };
