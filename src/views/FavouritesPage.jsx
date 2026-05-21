"use client";

import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import PodcastRow from "../components/PodcastRow";
import { useTracks, slugify } from "../firebase/TracksContext";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import Loader from "../components/Loader";
import "./Home.css";

function FavouritesPage() {
  const router = useRouter();
  const { tracks, loading } = useTracks();
  const { user, favourites, isFavourite, isLiked } = useAuth();
  const { currentTrack } = usePlayer();

  if (loading) return <Loader show />;

  if (!user) {
    return (
      <div>
        <Navbar />
        <div className="content" style={{ padding: 40, textAlign: "center" }}>
          <h2>Please log in to view your favourites.</h2>
        </div>
      </div>
    );
  }

  const favTracks = tracks.filter((t) => favourites.includes(t.title));

  return (
    <div>
      <Navbar />

      <div className="content">
        {favTracks.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#666" }}>
            <h3>No favourites yet</h3>
            <p>Tap the + icon on the mini-player to add a song.</p>
          </div>
        ) : (
          <PodcastRow
            title="Your Favourites"
            subtitle="Songs you've added to favourites"
            podcasts={favTracks}
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

export default FavouritesPage;
