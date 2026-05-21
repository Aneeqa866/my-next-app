"use client";

import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import PodcastRow from "../components/PodcastRow";
import { slugify } from "../firebase/TracksContext";
import { usePlayer } from "../context/PlayerContext";
import { useTracks } from "../firebase/TracksContext";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import "./Home.css";

function Home() {
  const router = useRouter();

  const { currentTrack } = usePlayer();
  const { user, isLiked, progress } = useAuth();

  // Tracks coming from Firebase Context
  const { tracks, loading } = useTracks();

  //  route to player page
  const go = (t) => router.push(`/player/${slugify(t.title)}`);

  // All fetched tracks
  const allShown = tracks;

  // Continue listening — driven by Firestore progress doc
  const continueList = user
    ? allShown.filter((t) => {
      const p = progress?.[slugify(t.title)];
      return p && Number(p.position) > 0;
    })
    : [];

  // Loading state while Firebase fetches data
  if (loading) {
    return <Loader show />;
  }

  return (
    <div>
      <Navbar />

      <div className="content">
        {/* ALL TRACKS ROW */}
        <PodcastRow
          title="All tracks"
          subtitle="The best tracks handpicked for you"
          podcasts={allShown}
          onSelect={go}
          activeTitle={currentTrack?.title}
          isLiked={isLiked}
        />

        {/* CONTINUE LISTENING ROW — only when logged in */}
        {user && continueList.length > 0 && (
          <PodcastRow
            title="Continue listening"
            subtitle="Tracks you started — pick up where you left off"
            podcasts={continueList}
            onSelect={go}
            isLiked={isLiked}
          />
        )}
      </div>
    </div>
  );
}

export default Home;