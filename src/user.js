import React, { useState } from "react";

function Card({ title }) {
    const [liked, setLiked] = useState(false);

    return (
        <div className="mini-card">
            <h2>{title}</h2>
            <p>{liked ? "Liked" : "Not Liked"}</p>
            <button id="button" onClick={() => setLiked(!liked)}>
                {liked ? "Unlike" : "Like"}
            </button>
        </div>
    );
}

export default Card;
