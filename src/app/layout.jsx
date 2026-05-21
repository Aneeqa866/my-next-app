import "./globals.css";

import { AuthProvider } from "../context/AuthContext";
import { TracksProvider } from "../firebase/TracksContext";
import { PlayerProvider } from "../context/PlayerContext";

import MiniPlayer from "../components/MiniPlayer";

export const metadata = {
    title: "SoundNest",
    description: "Discover and stream tracks",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <TracksProvider>
                        <PlayerProvider>
                            {children}
                            <MiniPlayer />
                        </PlayerProvider>
                    </TracksProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
