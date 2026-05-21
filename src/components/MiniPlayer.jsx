"use client";

import { useState } from "react";
import { FiPlay, FiPause, FiPlus, FiHeart, FiSkipBack, FiSkipForward } from "react-icons/fi";
import { MdReplay10, MdForward10, MdOutlineSpeed } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { usePlayer } from "../context/PlayerContext";
import { useTracks } from "../firebase/TracksContext";
import { useAuth } from "../context/AuthContext";
import { IoIosVolumeLow } from "react-icons/io";
import "./MiniPlayer.css";

const SPEED_OPTIONS = [0.25, 0.5, 1, 1.25, 1.5, 2];

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function MiniPlayer() {
  const { currentTrack, playing, current, duration, togglePlay, seek, playTrack, volume, setVolume, speed, setSpeed } = usePlayer();
  const pathname = usePathname();
  const [speedOpen, setSpeedOpen] = useState(false);
  const { tracks } = useTracks();
  const { user, toggleLike, isLiked, toggleFavourite, isFavourite } = useAuth();
  const router = useRouter();

  if (!currentTrack) return null;
  if (pathname && pathname.startsWith("/player")) return null;
  const idx = tracks.findIndex((t) => t.title === currentTrack.title);
  const goNext = () => {
    if (idx === -1 || tracks.length === 0) return;
    playTrack(tracks[(idx + 1) % tracks.length]);
  };
  const goPrev = () => {
    if (idx === -1 || tracks.length === 0) return;
    playTrack(tracks[(idx - 1 + tracks.length) % tracks.length]);
  };

  return (
    <div className="mini-player">
      <div className="mp-info">
        <Image src={currentTrack.image} alt={currentTrack.title} width={56} height={56} />
        <div className="mp-text">
          <div className="mp-title">{currentTrack.title}</div>
          <div className="mp-sub">{currentTrack.subtitle}</div>
          <div className="mp-extras">
            <button
              aria-label="Add to Favourites"
              title="Add to Favourites"
              onClick={() => {
                if (!user) {
                  alert("Please log in to add to favourites.");
                  return;
                }
                if (!isFavourite(currentTrack.title)) {
                  toggleFavourite(currentTrack.title);
                }
                router.push("/favourites");
              }}
              className={isFavourite(currentTrack.title) ? "liked" : ""}
            >
              <FiPlus />
            </button>
            <button
              aria-label="Like song"
              title="Like song"
              onClick={() => {
                if (!user) {
                  alert("Please log in to like this song.");
                  return;
                }
                toggleLike(currentTrack.title);
              }}
              className={isLiked(currentTrack.title) ? "liked" : ""}
            >
              <FiHeart />
            </button>
          </div>
        </div>
      </div>

      <div className="mp-center">
        <div className="mp-controls">
          <div className="mp-speed-wrap">
            <button
              aria-label="Speed"
              className="mp-speed-btn"
              onClick={() => setSpeedOpen((o) => !o)}
            >
              <MdOutlineSpeed />
              <span className="mp-speed-label">{speed}x</span>
            </button>
            {speedOpen && (
              <ul className="mp-speed-popup">
                {SPEED_OPTIONS.map((s) => (
                  <li
                    key={s}
                    className={s === speed ? "active" : ""}
                    onClick={() => {
                      setSpeed(s);
                      setSpeedOpen(false);
                    }}
                  >
                    {s}x
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button aria-label="Previous" onClick={goPrev}><FiSkipBack /></button>
          <button
            aria-label="Back 10 seconds"
            onClick={() => seek(Math.max(0, current - 10))}
          >
            <MdReplay10 />
          </button>
          <button
            className="mp-play"
            aria-label={playing ? "Pause" : "Play"}
            onClick={togglePlay}
          >
            {playing ? <FiPause /> : <FiPlay />}
          </button>
          <button
            aria-label="Forward 10 seconds"
            onClick={() => seek(Math.min(duration || 0, current + 10))}
          >
            <MdForward10 />
          </button>
          <button aria-label="Next" onClick={goNext}><FiSkipForward /></button>
        </div>

        <div className="mp-progress">
          <span>{formatTime(current)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={current}
            onChange={(e) => seek(Number(e.target.value))}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="mp-left">
        <div className="mp-volume-icon"><button aria-label="Volume"><IoIosVolumeLow /></button></div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="mp-volume"
        />
      </div>
    </div>
  );
}

export default MiniPlayer;
