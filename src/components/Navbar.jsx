"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FiSearch, FiMenu, FiHeart, FiPlus, FiLogOut } from "react-icons/fi";
import logo from "../assets/Group 2 (1).png";
import logoRight from "../assets/Group 4.png";

const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false });
import { useAuth } from "../context/AuthContext";
import { useTracks, slugify } from "../firebase/TracksContext";
import "./Navbar.css";

function Navbar() {
  const router = useRouter();
  const goHome = () => router.push("/");
  const { user, logout } = useAuth();
  const { tracks } = useTracks();
  const [authOpen, setAuthOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const results = q
    ? tracks
      .filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.subtitle?.toLowerCase().includes(q) ||
          t.people?.toLowerCase().includes(q)
      )
      .slice(0, 6)
    : [];

  const go = (path) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-menu-wrap" ref={menuRef}>
          <FiMenu
            className="menu-icon"
            onClick={() => setMenuOpen((o) => !o)}
          />
          {menuOpen && (
            <ul className="navbar-menu-dropdown">
              <li onClick={() => go("/favourites")}>
                <FiPlus /> Favourite songs
              </li>
              <li onClick={() => go("/liked")}>
                <FiHeart /> Liked songs
              </li>
              {user && (
                <li
                  className="navbar-menu-logout"
                  onClick={async () => {
                    setMenuOpen(false);
                    await logout();
                    router.push("/");
                  }}
                >
                  <FiLogOut /> Logout
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="navbar-logo" onClick={goHome} style={{ cursor: "pointer" }}>
          <Image src={logo} alt="logo" priority />
        </div>

        <div className="search-box">
          <FiSearch />
          <input
            type="search"
            placeholder="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {results.length > 0 && (
            <ul className="search-results">
              {results.map((t, i) => (
                <li
                  key={i}
                  onClick={() => {
                    setQuery("");
                    router.push(`/player/${slugify(t.title)}`);
                  }}
                >
                  <Image src={t.image} alt={t.title} width={40} height={40} />
                  <div>
                    <div className="search-result-title">{t.title}</div>
                    <div className="search-result-sub">{t.subtitle}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {q && results.length === 0 && (
            <ul className="search-results">
              <li className="search-empty">No matches for "{query}"</li>
            </ul>
          )}
        </div>

        <div className="navbar-spacer" />

        {user ? (
          <div className="navbar-user">
            <span className="navbar-user-name">{user.name}</span>
            <button
              className="navbar-login"
              onClick={async () => {
                await logout();
                router.push("/");
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button className="navbar-login" onClick={() => setAuthOpen(true)}>
            Login
          </button>
        )}

        <Image
          src={logoRight}
          alt="logo right"
          className="navbar-logo-right"
          onClick={goHome}
          style={{ cursor: "pointer" }}
          priority
        />
      </nav>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}

export default Navbar;
