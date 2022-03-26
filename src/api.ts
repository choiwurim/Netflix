const API_KEY="6c23fb6394ba6946dbb1015580a6a4f5";
const BASE_PATH="https://api.themoviedb.org/3";

interface movie{
    id:number;
    backdrop_path:string;
    poster_path:string;
    title:string;
    overview:string;
}

export interface getMoviesResult{
    dates:{
        maximum:string;
        minimum:string;
    },
    page:number;
    results:movie[];
    total_pages:number;
    total_results:number;
}

export function getMovies(){
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        (response)=>response.json()
    );
}
