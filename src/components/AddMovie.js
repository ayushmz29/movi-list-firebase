import React, { useState } from "react";

import classes from "./AddMovie.module.css";

const AddMovie = (props) => {
    // const titleRef = useRef("");
    // const openingTextRef = useRef("");
    // const releaseDateRef = useRef("");
    const [title, setTitle] = useState("");
    const [openingText, setOpeningText] = useState("");
    const [releaseDate, setReleseDate] = useState("");

    const submitHandler = (event) => {
        event.preventDefault();

        // could add validation here...

        // creating a new object using the input values from the form
        const movie = {
            title: title,
            openingText: openingText,
            releaseDate: releaseDate,
        };

        props.onAddMovie(movie);
    };

    return (
        <form onSubmit={submitHandler}>
            <div className={classes.control}>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(event) => {
                        setTitle(event.target.value);
                    }}
                />
            </div>

            <div className={classes.control}>
                <label htmlFor="opening-text">Opening Text</label>
                <textarea
                    rows="5"
                    id="opening-text"
                    value={openingText}
                    onChange={(event) => {
                        setOpeningText(event.target.value);
                    }}
                ></textarea>
            </div>

            <div className={classes.control}>
                <label htmlFor="date">Release Date</label>
                <input
                    type="date"
                    id="date"
                    value={releaseDate}
                    onChange={(event) => {
                        setReleseDate(event.target.value);
                    }}
                />
            </div>

            <button>Add Movie</button>
        </form>
    );
};

export default AddMovie;
