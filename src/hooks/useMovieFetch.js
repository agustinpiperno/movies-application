import {useState, useEffect} from 'react';
import API from '../API';
//helpers
import { isPersistedState } from '../helpers';
export const useMovieFetch = MovieId => {
    const [state, setState] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchMovie = async() => {
            try{
                setLoading(true);
                setError(false);

                const movie = await API.fetchMovie(MovieId);
                const credits = await API.fetchCredits(MovieId);
                // get directors only
                const directors = credits.crew.filter(
                    member => member.job === "Director"
                );

                setState({
                    ...movie,
                    actors: credits.cast,
                    directors
                });
                setLoading(false);
            } catch (error){
                setError(true);
            }
        };

        const sessionState = isPersistedState(MovieId);
        
        if(sessionState){
            setState(sessionState);
            setLoading(false);
            return;
        }

        fetchMovie();
    }, [MovieId]);
    //write to session storage
    useEffect(() => {
        sessionStorage.setItem(MovieId, JSON.stringify(state));
    },[MovieId, state]);
    
    return {state, loading, error};
}