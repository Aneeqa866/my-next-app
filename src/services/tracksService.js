import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export async function fetchTracks() {
  const snap = await getDocs(collection(db, "Tracks"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
