import {useQuery} from "react-query";
import { getMovies, getMoviesResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion , AnimatePresence, useViewportScroll} from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper=styled.div`
background:black;
padding-bottom:200px;
`;

const Loader=styled.div`
height:20vh;
display:flex;
justify-content:center;
align-items:center;
`;

const Banner=styled.div<{bgPhoto:string}>`
height:100vh;
display:flex;
flex-direction:column;
justify-content:center;
padding:60px;
background-image:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,1)),url(${(props)=>props.bgPhoto});
background-size:cover;
`;

const Title=styled.h2`
font-size:60px;
margin-bottom:20px;
`;

const Overview=styled.p`
font-size:30px;
width:50%;
`;

const Slider=styled.div`
position:relative;
top:-100px;
`;

const Row=styled(motion.div)`
display:grid;
grid-template-columns:repeat(6, 1fr);
gap:5px;
margin-bottom:5px;
position:absolute;
width:100%;
`;

const Box=styled(motion.div)<{bgPhoto:string}>`
background-color:white;
background-image:url(${props=>props.bgPhoto});
background-size:cover;
background-position:center center;
font-size:66px;
height:200px;
&:first-child{
    transform-origin:center left;
}
&:last-child{
    trasform-origin:center right;
}
cursor:pointer;
`;

const rowVariants={
    hidden:{
        x:window.outerWidth+5,
    },
    visible:{
        x:0
    },
    exit:{
        x:-window.outerWidth-5,
    }
}

const BoxVariants={
    normal:{
        scale:1,
    },
    hover:{
        scale:1.3,
        y:-80,
        transition:{delay:0.5, type:"tween", duration:0.1},
    },
}

const Info=styled(motion.div)`
padding:10px;
background-color:${(props)=>props.theme.black.lighter};
opacity:0;
position:absolute;
width:100%;
bottom:0;
h4{
    text-align:center;
    font-size:18px;
}
`;

const InfoVariants={
    hover:{
        opacity:1,
        transition:{
            delay:0.5,
            duration:0.1,
            type:"tween",
        }
    }
};

const Overlay=styled(motion.div)`
position:fixed;
top:0;
width:100%;
height:100%;
background-color:rgba(0,0,0,0.5);
opacity:0;
`;

const BigMovie=styled(motion.div)`
position:absolute;
width:40vw;
height:80vh;
left:0;
right:0;
margin:0 auto;
border-radius:10px;
overflow:hidden;
background-color:${(props)=>props.theme.black.lighter};
`;

const Cover=styled.img`
width:100%;
height:400px;
background-size:cover;
background-position:center center;
`;

const Movietitle=styled.h3`
color:${(props)=>props.theme.white.lighter};
text-align:center;
font-size:35px;
`;

const MovieOverview=styled.p`
color:${(props)=>props.theme.white.darker};
padding:20px;
top:-10px;
position:relative;
`

const offset=6;

function Home(){
    const history=useHistory();
    const {scrollY}=useViewportScroll();
    const MovieWatch=useRouteMatch<{movieId:string}>("/movies/:movieId");
    const {data, isLoading}=useQuery<getMoviesResult>(["movies","nowPlaying"],getMovies);
    const [index, setIndex]=useState(0);
    const [leaving, setLeaving]=useState(false);
    const increaseIndex=()=>{
       if(data){
            if(leaving) return;
            toggleLeaving();
            const totalMovies=data.results.length-1;
            const maxIndex=Math.floor(totalMovies/offset)-1;
            setIndex((prev)=>prev===maxIndex ? 0:prev+1);
       }
    };
    const toggleLeaving=()=>setLeaving((prev)=>!prev);
    const onBoxClick=(movieId:number)=>{
        history.push(`/movies/${movieId}`)
    };
    const onOverlayClick=()=>history.push("/");
    const clickedMovie=MovieWatch?.params.movieId && data?.results.find(movie=>movie.id+""===MovieWatch.params.movieId);
    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ):(
                <>
                    <Banner onClick={increaseIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            <Row variants={rowVariants} initial="hidden" animate="visible" exit="exit" transition={{type:"tween", duration:1}} key={index}>
                                {data?.results.slice(1).slice(offset*index, offset*index+offset).map((movie)=>(
                                    <Box 
                                        layoutId={movie.id+""}
                                        variants={BoxVariants} 
                                        key={movie.id} 
                                        initial="normal" 
                                        transition={{type:"tween"}} 
                                        onClick={()=>onBoxClick(movie.id)}
                                        whileHover="hover" 
                                        bgPhoto={makeImagePath(movie.backdrop_path, "w500")} 
                                    >
                                        <Info variants={InfoVariants}>
                                            <h4>{movie.title}</h4>
                                        </Info>
                                    </Box>
                                ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <AnimatePresence>
                        {MovieWatch ? (
                            <>
                            <Overlay 
                                onClick={onOverlayClick}
                                exit={{opacity:0}}
                                animate={{opacity:1}}
                            />
                            <BigMovie
                                style={{top:scrollY.get()+100}}
                                layoutId={MovieWatch.params.movieId}
                            >
                                {clickedMovie && <>
                                    <Cover style={{backgroundImage:`linear-gradient(to top, black, transparent), url(${makeImagePath(clickedMovie.backdrop_path,"w500")})`}}/>
                                    <Movietitle>{clickedMovie.title}</Movietitle>
                                    <MovieOverview>{clickedMovie.overview}</MovieOverview>
                                </>}
                            </BigMovie>
                            </>
                        ):null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Home;