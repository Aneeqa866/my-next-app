"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { slugify } from "../data/tracks";
import Loader from "../components/Loader";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [likes, setLikes] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const u = {
          uid: fbUser.uid,
          email: fbUser.email,
          name: fbUser.displayName || fbUser.email.split("@")[0],
        };
        setUser(u);
      } else {
        setUser(null);
        setLikes([]);
        setFavourites([]);
        setProgress({});
      }
      setAuthReady(true);
    });
    return unsub;
  }, []);

  // Load progress, likes, favourites once per login from Firestore
  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;
    (async () => {
      try {
        const [progSnap, likesSnap, favsSnap] = await Promise.all([
          getDocs(collection(db, "users", user.uid, "progress")),
          getDocs(collection(db, "users", user.uid, "likes")),
          getDocs(collection(db, "users", user.uid, "favourites")),
        ]);
        if (cancelled) return;
        const nextProgress = {};
        progSnap.forEach((d) => {
          nextProgress[d.id] = d.data();
        });
        setProgress(nextProgress);
        setLikes(likesSnap.docs.map((d) => d.data().title).filter(Boolean));
        setFavourites(
          favsSnap.docs.map((d) => d.data().title).filter(Boolean)
        );
      } catch (err) {
        console.error("[auth] load user data FAILED:", err);
        if (!cancelled) {
          setProgress({});
          setLikes([]);
          setFavourites([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const saveProgress = async (slug, position, title) => {
    if (!user?.uid || !slug) return;
    setProgress((prev) => ({
      ...prev,
      [slug]: { position, title: title || "" },
    }));
    try {
      await setDoc(
        doc(db, "users", user.uid, "progress", slug),
        { position, title: title || "", updatedAt: serverTimestamp() },
        { merge: true }
      );
      console.log("[progress] saved to Firestore:", slug, position);
    } catch (err) {
      console.error("[progress] save FAILED:", err);
    }
  };

  const clearProgress = async (slug) => {
    if (!user?.uid || !slug) return;
    setProgress((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
    try {
      await deleteDoc(doc(db, "users", user.uid, "progress", slug));
      console.log("[progress] cleared in Firestore:", slug);
    } catch (err) {
      console.error("[progress] clear FAILED:", err);
    }
  };

  const login = async (email, password) => {
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setBusy(false);
    }
  };

  const signup = async (name, email, password) => {
    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    setBusy(true);
    try {
      await signOut(auth);
    } finally {
      setBusy(false);
    }
  };

  const toggleLike = async (title) => {
    if (!user || !title) return;
    const slug = slugify(title);
    const already = likes.includes(title);
    setLikes((prev) =>
      already ? prev.filter((t) => t !== title) : [...prev, title]
    );
    try {
      const ref = doc(db, "users", user.uid, "likes", slug);
      if (already) {
        await deleteDoc(ref);
      } else {
        await setDoc(ref, { title, createdAt: serverTimestamp() });
      }
    } catch (err) {
      console.error("[likes] sync FAILED:", err);
      setLikes((prev) =>
        already ? [...prev, title] : prev.filter((t) => t !== title)
      );
    }
  };

  const isLiked = (title) => likes.includes(title);

  const toggleFavourite = async (title) => {
    if (!user || !title) return;
    const slug = slugify(title);
    const already = favourites.includes(title);
    setFavourites((prev) =>
      already ? prev.filter((t) => t !== title) : [...prev, title]
    );
    try {
      const ref = doc(db, "users", user.uid, "favourites", slug);
      if (already) {
        await deleteDoc(ref);
      } else {
        await setDoc(ref, { title, createdAt: serverTimestamp() });
      }
    } catch (err) {
      console.error("[favourites] sync FAILED:", err);
      setFavourites((prev) =>
        already ? [...prev, title] : prev.filter((t) => t !== title)
      );
    }
  };

  const isFavourite = (title) => favourites.includes(title);

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        busy,
        login,
        signup,
        logout,
        likes,
        toggleLike,
        isLiked,
        favourites,
        toggleFavourite,
        isFavourite,
        progress,
        saveProgress,
        clearProgress,
      }}
    >
      {children}
      <Loader show={busy} />
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
