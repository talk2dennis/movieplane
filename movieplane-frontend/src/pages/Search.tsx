import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import type { IMovie } from "../types";
import { useParams } from "react-router-dom";
import MovieSection from "../components/RenderMovie";
import Loading from "../components/Loading";
import axiosClient from "../api/axiosClient";
import "./css/Favorites.css";

const Search = () => {
    const { isAuthenticated } = useAuth();
    const [search, setSearch] = useState<IMovie[]>([]);
    const { query } = useParams();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query && query?.trim() === "") {
                setError("Search query cannot be empty.");
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const response = await axiosClient.get<IMovie[]>(`/movies/search`, {
                    params: { query }
                });
                setSearch(response.data || []);
            } catch (error) {
                console.error("Search error:", error);
                setError("Failed to fetch search results. Please try again later.");
            } finally {
                setLoading(false);
            }
        }

        fetchSearchResults();
    }, [query]);

    if (loading) {
        return <Loading title="Please wait while we get your movies"/>;
    }
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="favorites-page">
            {isAuthenticated && search.length > 0 ? <MovieSection movies={search} title="Your Search Results" /> : (<div className="no-favorites">
                <h2>No Search Result for { }</h2>
                <p>It seems we couldn't find any movies matching your search term.</p>
                <p>Please try a different search term or check your spelling.</p>
                <p>Browse the <a href="/">home page</a> to find movies you like!</p>
            </div>)}
        </div>
    );
}

export default Search;