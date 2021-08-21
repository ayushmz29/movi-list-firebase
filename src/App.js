import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // using useCallback() to solve the referential inequallity problem.
    // since we are using this function inside the dependency list of useEffect() below,
    // we need to make sure that this fuction is only when it's needed
    // since functions in javaScript are objects and JS cannot distinguish between two objects having same values.
    const fetchMoviesHandler = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                "https://react-todo-7a7c1-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json"
            );
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            const data = await response.json();
            // console.log(data);
            /* STRUCTURE of response:-

{-MhcsE6rLyYk_vrPLx56: {…}, -MhcxkV6xZI5kVC1BzfO: {…}}
-MhcsE6rLyYk_vrPLx56: {openingText: "Some Text", releaseDate: "2021-08-21", title: "My First Movie"}
-MhcxkV6xZI5kVC1BzfO: {openingText: "Some Text Here", releaseDate: "2021-08-14", title: "My Second Movie"}
            */

            let loadedMovies = [];

            /* iterating over the JS object using for loop
            here 'key' is the auto generated id of individual movies
            here for every 'key', we have the movie details */

            for (const key in data) {
                const movie = {
                    id: key,
                    //* dynamically accessing properties of an JS object
                    title: data[key].title,
                    openingText: data[key].openingText,
                    releaseDate: data[key].releaseDate,
                };
                loadedMovies.push(movie);
            }

            setMovies(loadedMovies);
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    }, []);

    // using useEffect Hook here:
    useEffect(() => {
        fetchMoviesHandler();
    }, [fetchMoviesHandler]);

    // Adding movie to the Firebase DB by sending a POST request:-
    // Incase of firebase when we send a POST request to our DB, it will create a new
    // resource (node) there and also assigns them with an unique id
    const addMovieHandler = async (movie) => {
        await fetch(
            "https://react-todo-7a7c1-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json",
            {
                method: "POST",
                // now 'body' needs JSON object and not an JS object
                // so we need 'movie' JS object to JSON object using 'stringify' method
                body: JSON.stringify(movie),
                headers: {
                    // Content-Type: application/json >> Indicates that the request body format is JSON.
                    "Content-Type": "application/json",
                },
            }
        );
        // console.log(response);
        // const data = await response.json();
        // console.log(data);

        // *updating the list after movie is added
        fetchMoviesHandler();
    };

    // *Delete Movie Handler function
    const onDeleteHandler = async (movieId) => {
        // console.log(movieId);

        await fetch(
            `https://react-todo-7a7c1-default-rtdb.asia-southeast1.firebasedatabase.app/movies/${movieId}.json`,
            {
                method: "DELETE",
            }
        );

        // *fetch movies again after deleting a movie from the list
        fetchMoviesHandler();
    };

    let content = <p>Found no movies.</p>;

    if (movies.length > 0) {
        content = <MoviesList movies={movies} onDelete={onDeleteHandler}/>;
    }

    if (error) {
        content = <p>{error}</p>;
    }

    if (isLoading) {
        content = <p>Loading...</p>;
    }

    return (
        <>
            <section>
                <AddMovie onAddMovie={addMovieHandler} />
            </section>
            <section>
                <button onClick={fetchMoviesHandler}>Fetch Movies</button>
            </section>
            <section>{content}</section>
        </>
    );
}

export default App;
