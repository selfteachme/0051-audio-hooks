import React, { useState, useRef, useEffect } from 'react'
import PropTypes from "prop-types";
import styles from "../styles/AudioPlayer.module.css";
import { BsArrowLeftShort } from "react-icons/bs"
import { BsArrowRightShort } from "react-icons/bs"
import { FaPlay } from "react-icons/fa"
import { FaPause } from "react-icons/fa"
import { useAudioPlayer } from "../hooks/AudioPlayerHooks";

const AudioPlayer = ({ chapters, timeJump, track }) => {
  const {
    audioPlayer,
    backThirty,
    calculateTime,
    changeRange,
    currentTime,
    duration,
    forwardThirty,
    isPlaying,
    play,
    progressBar,
    setDuration,
    setIsPlaying,
    timeTravel,
    togglePlayPause,
    setTimeJump
  } = useAudioPlayer();

  // handle time jumps
  useEffect(() => {
    setTimeJump(timeJump);
  }, [timeJump])

  return (
    <div className={styles.audioPlayer}>
      <audio ref={audioPlayer} src={track} preload="metadata" />
      <button className={styles.forwardBackward} onClick={backThirty}><BsArrowLeftShort /> 30</button>
      <button onClick={togglePlayPause} className={styles.playPause}>
        {isPlaying ? <FaPause /> : <FaPlay className={styles.play} />}
      </button>
      <button className={styles.forwardBackward} onClick={forwardThirty}>30 <BsArrowRightShort /></button>

      {/* current time */}
      <div className={styles.currentTime}>{calculateTime(currentTime)}</div>

      {/* progress bar */}
      <div className={styles.progressBarWrapper}>
        <input type="range" className={styles.progressBar} defaultValue="0" ref={progressBar} onChange={changeRange} />
        {chapters.map((chapter, i) => {
          const leftStyle = chapter.start / duration * 100;
          const widthStyle = (chapter.end - chapter.start) / duration * 100;
          return (
            <div
              key={i}
              className={`${styles.chapter} ${chapter.start == 0 && styles.start} ${chapter.end == duration && styles.end}`}
              style={{
                '--left': `${leftStyle}%`,
                '--width': `${widthStyle}%`,
              }}
            ></div>
          )
        })}
      </div>

      {/* duration */}
      <div className={styles.duration}>{duration && calculateTime(duration)}</div>

    </div>
  )
}

AudioPlayer.propTypes = {
  chapters: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number
  })),
  timeJump: PropTypes.number,
  track: PropTypes.string.isRequired
};

AudioPlayer.defaultProps = {
  chapters: [],
  timeJump: 0,
};

export { AudioPlayer }
