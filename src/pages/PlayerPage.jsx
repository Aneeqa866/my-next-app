"use client";

import { useParams, useRouter } from "next/navigation";
import Player from "../components/Player";
import { slugify, useTracks } from "../firebase/TracksContext";
import Loader from "../components/Loader";

function PlayerPage() {
  const params = useParams();
  const slug = params.slug;
  const router = useRouter();
  const { tracks, loading } = useTracks();


  if (loading) {
    return <Loader show />;
  }

  if (tracks.length === 0) {
    return <div className="loading">No tracks available.</div>;
  }

  const podcast = tracks.find((t) => slugify(t.title) === slug) || tracks[0];
  const sameArtist = tracks.filter(
    (t) => t.people === podcast.people && t.title !== podcast.title
  );
  const others = tracks.filter(
    (t) => t.people !== podcast.people && t.title !== podcast.title
  );
  const related = [podcast, ...sameArtist, ...others].filter(
    (t, i, arr) => arr.findIndex((x) => x.title === t.title) === i
  );

  return (
    <Player
      podcast={podcast}
      related={related}
      onClose={() => router.push("/")}
      onSelect={(t) => router.push(`/player/${slugify(t.title)}`)}
    />
  );
}

export default PlayerPage;
