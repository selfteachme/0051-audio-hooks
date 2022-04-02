import React, { useState, useRef, useEffect } from 'react'

const useAudioPlayer = () => {
  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeJump, setTimeJump] = useState(0);

  // references
  const audioPlayer = useRef<HTMLAudioElement>(null);   // reference our audio component
  const progressBar = useRef<HTMLInputElement>(null);   // reference our progress bar
  const animationRef = useRef<number>();  // reference the animation

  // handle time jumps
  useEffect(() => {
    timeTravel(timeJump);
    // setIsPlaying(true);
    // play();
  }, [timeJump])

  // grabs the loaded metadata
  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current!.duration);
    setDuration(seconds);
    progressBar.current!.max = seconds.toString();
  }, [audioPlayer?.current?.onloadedmetadata, audioPlayer?.current?.readyState])


  // when you get to the end
  useEffect(() => {
    if (Number(duration) > 1 && Number(currentTime) === Number(duration)) {
      togglePlayPause();
      timeTravel(0);
    }
  }, [currentTime, duration]);

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  }

  const play = () => {
    audioPlayer.current!.play();
    animationRef.current = requestAnimationFrame(whilePlaying)
  }

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      play();
    } else {
      audioPlayer.current!.pause();
      cancelAnimationFrame(animationRef.current!);
    }
  }

  const whilePlaying = () => {
    progressBar.current!.value = String(audioPlayer.current!.currentTime);
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  }

  const changeRange = () => {
    audioPlayer.current!.currentTime = Number(progressBar.current!.value);
    changePlayerCurrentTime();
  }

  const changePlayerCurrentTime = () => {
    progressBar.current!.style.setProperty('--seek-before-width', `${Number(progressBar.current!.value) / duration * 100}%`)
    setCurrentTime(Number(progressBar.current!.value));
  }

  const backThirty = () => {
    timeTravel(Number(progressBar.current!.value) - 30);
  }

  const forwardThirty = () => {
    timeTravel(Number(progressBar.current!.value) + 30);
  }

  const timeTravel = (newTime: number) => {
    progressBar.current!.value = String(newTime);
    changeRange();
  }

  return {
    isPlaying,
    duration,
    currentTime,
    audioPlayer,
    progressBar,
    calculateTime,
    togglePlayPause,
    changeRange,
    backThirty,
    forwardThirty,
    timeTravel,
    setDuration,
    setIsPlaying,
    setTimeJump,
    play
  }
}

export { useAudioPlayer }