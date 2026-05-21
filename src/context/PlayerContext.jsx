"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const PlayerContext = createContext(null);

const PROGRESS_WRITE_INTERVAL_MS = 5000;

export function PlayerProvider({ children }) {
  const { user, progress, saveProgress, clearProgress } = useAuth();
  const audioRef = useRef(null);
  const lastWriteRef = useRef(0);
  const pendingResumeRef = useRef(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.6);
  const [speed, setSpeedState] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => {
      setCurrent(audio.currentTime);
      if (
        user?.uid &&
        currentTrack?.title &&
        audio.currentTime > 2 &&
        audio.duration &&
        audio.currentTime < audio.duration - 2
      ) {
        const now = Date.now();
        if (now - lastWriteRef.current >= PROGRESS_WRITE_INTERVAL_MS) {
          lastWriteRef.current = now;
          saveProgress(
            slugify(currentTrack.title),
            audio.currentTime,
            currentTrack.title
          ).catch(() => {});
        }
      }
    };

    const onMeta = () => {
      setDuration(audio.duration);
      if (pendingResumeRef.current > 0) {
        const t = pendingResumeRef.current;
        pendingResumeRef.current = 0;
        if (t < audio.duration - 2) {
          audio.currentTime = t;
          setCurrent(t);
        }
      }
    };

    const onEnd = () => {
      setPlaying(false);
      if (user?.uid && currentTrack?.title) {
        clearProgress(slugify(currentTrack.title)).catch(() => {});
      }
    };

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [user, currentTrack, saveProgress, clearProgress]);

  const playTrack = (track) => {
    if (!track) return;
    const audio = audioRef.current;
    if (currentTrack?.title !== track.title) {
      const slug = slugify(track.title);
      const saved = progress?.[slug]?.position || 0;
      pendingResumeRef.current = saved;
      lastWriteRef.current = 0;
      setCurrentTrack(track);
      setCurrent(0);
      audio.src = track.audio;
    }
    audio.play().catch(() => {});
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (audio.paused) audio.play();
    else audio.pause();
  };

  const seek = (t) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = t;
    setCurrent(t);
  };

  const setVolume = (v) => {
    const audio = audioRef.current;
    if (audio) audio.volume = v;
    setVolumeState(v);
  };

  const setSpeed = (s) => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = s;
    setSpeedState(s);
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, []);

  const stop = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setPlaying(false);
    setCurrentTrack(null);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        playing,
        current,
        duration,
        volume,
        setVolume,
        speed,
        setSpeed,
        playTrack,
        togglePlay,
        seek,
        stop,
      }}
    >
      {children}
      <audio ref={audioRef} preload="metadata" />
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
