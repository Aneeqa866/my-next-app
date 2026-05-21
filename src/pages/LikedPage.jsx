"use client";

import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import PodcastRow from "../components/PodcastRow";
import { useTracks, slugify } from "../firebase/TracksContext";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import Loader from "../components/Loader";
import "./Home.css";

function LikedPage() {
  const router = useRouter();
  const { tracks, loading } = useTracks();
  const { user, likes, isLiked, isFavourite } = useAuth();
  const { currentTrack } = usePlayer();

  if (loading) return <Loader show />;

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="content" style={{ padding: 40, textAlign: "center" }}>
          <h2>Please log in to view your liked songs.</h2>
        </div>
      </div>
    );
  }

  const likedTracks = tracks.filter((t) => likes.includes(t.title));

  return (
    <div>
      <Navbar />

      <div className="content">
        {likedTracks.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#666" }}>
            <h3>No liked songs yet</h3>
            <p>Tap the heart icon on the mini-player to like a song.</p>
          </div>
        ) : (
          <PodcastRow
            title="Liked Songs"
            subtitle="Songs you've liked"
            podcasts={likedTracks}
            onSelect={(t) => router.push(`/player/${slugify(t.title)}`)}
            activeTitle={currentTrack?.title}
            isLiked={isLiked}
            isFavourite={isFavourite}
          />
        )}
      </div>
    </div>
  );
}

export default LikedPage;
