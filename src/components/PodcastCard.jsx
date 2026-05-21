import { FiHeart } from "react-icons/fi";
import Image from "next/image";
import "./PodcastCard.css";

function PodcastCard({ title, subtitle, people, meta, image, onClick, active, liked }) {
    return (
        <div
            className={`card ${active ? "active" : ""}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            <div className="card-image">
                <Image
                    src={image}
                    alt={title}
                    width={300}
                    height={200}
                    sizes="(max-width: 640px) 80vw, 300px"
                />
            </div>
            <div className="card-title-row">
                <div className="card-title">{title}</div>
                {liked && <FiHeart className="card-liked-heart" />}
            </div>
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
            {people && <div className="card-people">{people}</div>}
            {meta && <div className="card-meta">{meta}</div>}
        </div>
    );
}

export default PodcastCard;
