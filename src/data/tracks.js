import img1 from "../assets/simg1.jpg";
import img2 from "../assets/simg2.jpg";
import img3 from "../assets/simg3.jpg";
import img4 from "../assets/simg4.jpg";
import img5 from "../assets/simg10.jpg";
import img6 from "../assets/simg6.jpg";
import img7 from "../assets/simg7.jpg";
import img8 from "../assets/simg8.jpg";

export const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const allTracks = [
  {
    title: "Escape Your Love",
    subtitle: "Fassounds • upbeat fashion pop",
    people: "By: Fassounds",
    meta: "Pop • Dance • Fashion | 00:02:30",
    audio: "/audio/fassounds-escape-your-love-upbeat-fashion-pop-dance-412230.mp3",
    image: img1,
  },
  {
    title: "Carnaval",
    subtitle: "Alec Koff • festive instrumental",
    people: "By: Alec Koff",
    meta: "Latin • Carnival • Instrumental | 00:02:15",
    audio: "/audio/alec_koff-carnaval-484622.mp3",
    image: img2,
  },
  {
    title: "Playful Night",
    subtitle: "Alex Zavesa • dance groove",
    people: "By: Alex Zavesa",
    meta: "Dance • Electronic • Playful | 00:02:45",
    audio: "/audio/alexzavesa-dance-playful-night-510786.mp3",
    image: img3,
  },
  {
    title: "Stomp Action",
    subtitle: "EnergySound • high-energy stomp",
    people: "By: EnergySound",
    meta: "Action • Cinematic • Rock | 00:02:00",
    audio: "/audio/energysound-stomp-action-music-513718.mp3",
    image: img4,
  },
  {
    title: "Medicine",
    subtitle: "Gvidon • atmospheric track",
    people: "By: Gvidon",
    meta: "Ambient • Chill • Indie | 00:03:00",
    audio: "/audio/gvidon-gvidon-medicine-364031.mp3",
    image: img5,
  },
  {
    title: "Water",
    subtitle: "Kontraa • afro pop vibes",
    people: "By: Kontraa",
    meta: "Afro Pop • World • Groove | 00:02:50",
    audio: "/audio/kontra water.mp3",
    image: img6,
  },
  {
    title: "Joyful Rhythm Walk",
    subtitle: "LightBeatsMusic • funky walk",
    people: "By: LightBeatsMusic",
    meta: "Funk • Upbeat • Walk | 00:02:20",
    audio: "/audio/lightbeatsmusic-joyful-rhythm-walk-funk-513936.mp3",
    image: img7,
  },
  {
    title: "Action Trailer Promo",
    subtitle: "MagpieMusic • cinematic rock",
    people: "By: MagpieMusic",
    meta: "Rock • Trailer • Promo | 00:01:55",
    audio: "/audio/magpiemusic-action-trailer-promo-rock-513687.mp3",
    image: img8,
  },
];

export const samplePodcasts = () => allTracks;
