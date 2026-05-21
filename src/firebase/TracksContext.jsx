"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchTracks } from "../services/tracksService";

export { slugify } from "../data/tracks";

const TracksContext = createContext();

export function TracksProvider({ children }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTracks()
      .then((data) => {
        console.log("[TracksContext] fetched", data.length, "tracks", data);
        setTracks(data);
      })
      .catch((err) => {
        console.error("fetch failed:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <TracksContext.Provider value={{ tracks, loading }}>
      {children}
    </TracksContext.Provider>
  );
}

export const useTracks = () => useContext(TracksContext);