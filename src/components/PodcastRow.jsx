"use client";

import { useRef } from "react";
import { FiChevronRight } from "react-icons/fi";
import PodcastCard from "./PodcastCard";
import "./PodcastRow.css";

function PodcastRow({ title, subtitle, podcasts, onSelect, activeTitle, isLiked }) {
    const scrollerRef = useRef(null);

    const scrollRight = () => {
        if (scrollerRef.current) {
            scrollerRef.current.scrollBy({ left: 400, behavior: "smooth" });
        }
    };

    return (
        <section className="row">
            <div className="row-header">
                <h2>{title}</h2>
                {subtitle && <span className="subtitle">{subtitle}</span>}
            </div>

            <div className="row-scroller" ref={scrollerRef}>
                {podcasts.map((p, i) => (
                    <PodcastCard
                        key={i}
                        {...p}
                        active={p.title === activeTitle}
                        liked={isLiked ? isLiked(p.title) : false}
                        onClick={() => onSelect && onSelect(p)}
                    />
                ))}
            </div>

            <button className="scroll-btn" onClick={scrollRight} aria-label="Scroll right">
                <FiChevronRight />
            </button>
        </section>
    );
}

export default PodcastRow;
