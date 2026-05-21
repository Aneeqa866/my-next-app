"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiPlay, FiPause, FiPlus } from "react-icons/fi";
import { RiShareForwardFill } from "react-icons/ri";
import Navbar from "./Navbar";
import { usePlayer } from "../context/PlayerContext";
import layerBg from "../assets/Layer 12 1.png";
import "./Player.css";

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return h ? `${h}:${m}:${s}` : `00:${m}:${s}`;
}

function Player({ podcast, related = [], onSelect }) {
  const { currentTrack, playing, current, duration, playTrack, togglePlay, seek } = usePlayer();
  const [view, setView] = useState("about");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (podcast && currentTrack?.title !== podcast.title) {
      playTrack(podcast);
    }
  }, [podcast]);

  const tracks = (related.length > 0 ? related : [podcast]).slice(0, 4);

  return (
    <div className="player-page">
      <Navbar />

      <Image src={layerBg} alt="" className="player-bg" priority />

      <div className="page-card">
        <div
          className="top-card"
          style={{ backgroundImage: `url(${podcast.image})` }}
        >
          <section className="hero">
            <div className="hero-card">
              <div className="hero-meta">
                <span className="dot red"></span> now playing &nbsp; <span>sharing</span>
              </div>

              <div className="hero-body">
                <div className="hero-info">
                  <h1>{podcast.title}</h1>
                  <p>{podcast.subtitle}</p>
                </div>
              </div>

              <div className="hero-progress">
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

              <div className="hero-actions">
                <button className="action-secondary">
                  More actions <FiPlus />
                </button>
                <button className="action-primary" onClick={togglePlay}>
                  {playing ? <FiPause /> : <FiPlay />} to listen
                </button>
              </div>
            </div>
          </section>

          <section className="about-row">
            <div className="about-with">
              <strong>{podcast.people}</strong>
              <p>{podcast.meta}</p>
            </div>
            <div className={`about-text ${expanded ? "expanded" : ""}`}>
              <div className="about-heading">
                <a
                  className={`about-series-link ${view === "about" ? "active" : ""}`}
                  onClick={() => setView("about")}
                >
                  About song
                </a>{"   "}
                <a
                  className={`song-summary-link ${view === "summary" ? "active" : ""}`}
                  onClick={() => setView("summary")}
                >
                  Song summary
                </a>
              </div>

              {view === "about" ? (
                <>
                  <p>
                    "{podcast.title}" is a timeless track that takes the listener on a
                    fascinating and unique journey through melody and emotion. Performed
                    by {podcast.people?.replace(/^By:\s*/, "")}, it blends heartfelt
                    lyrics with rich instrumentation, becoming a beloved piece across
                    generations.
                  </p>
                  {expanded && (
                    <p>
                      The song captures themes of love, loss, and hope — drawing
                      listeners back time and again. Released as part of {podcast.subtitle},
                      it has been covered by countless artists and remains a favorite at
                      live performances. Its production showcases layered vocals,
                      intricate harmonies, and a memorable hook that defines the genre.
                    </p>
                  )}
                  <a className="read-more" onClick={() => setExpanded((e) => !e)}>
                    {expanded ? "read less" : "read more"}
                  </a>
                </>
              ) : (
                <>
                  <p className="song-summary-text">
                    {podcast.title} — {podcast.subtitle}. {podcast.people}. A beautiful
                    composition blending melody, rhythm, and storytelling that captures
                    listeners with every note. {podcast.meta}
                  </p>
                  <a className="read-more" onClick={() => setExpanded((e) => !e)}>
                    {expanded ? "read less" : "read more"}
                  </a>
                </>
              )}
            </div>
          </section>
        </div>

        <div className="ad-banner">AD</div>

        <div className="tracks-pill">all of the tracks</div>

        <ul className="track-list">
          {tracks.map((ep, i) => (
            <li
              key={i}
              className={`track ${ep.title === podcast.title ? "active" : ""}`}
              onClick={() => onSelect && onSelect(ep)}
            >
              <div className="track-duration">
                {ep.meta?.split("|")[1]?.trim() || "00:00:00"}
              </div>

              <div className="track-details">
                <h4>
                  {i + 1}. {ep.title}
                </h4>
                <p>
                  "{ep.title}" — {ep.subtitle}. Performed by{" "}
                  {ep.people?.replace(/^By:\s*/, "")}, this track blends heartfelt
                  lyrics and rich instrumentation into a memorable listen.
                </p>
                <div className="track-meta">
                  <span>12.04.2022 | A in Tishrei 2015</span>
                  <a className="sharing">
                    sharing <RiShareForwardFill />
                  </a>
                </div>
              </div>

              <Image
                className="track-thumb"
                src={ep.image}
                alt={ep.title}
                width={250}
                height={180}
                sizes="(max-width: 640px) 100vw, 250px"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Player;
