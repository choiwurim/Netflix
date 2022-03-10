import {useParams} from "react-router";
import { useLocation} from "react-router-dom";
import styled from 'styled-components';
import {useEffect, useState} from 'react';
import { setPriority } from "os";

interface RouteParams{
    coinId: string;
};

interface RouteState{
    name: string;
}

const Container=styled.div`
padding:0px 20px;
max-width:480px;
margin:0 auto;
`;

const Header=styled.header`
height:15vh;
display:flex;
justify-content:center;
align-items:center;
`;

const Loader=styled.span`
text-align:center;
display:block;
`;

const Title=styled.div`
font-size:30px;
color:${(props)=>props.theme.accentColor};
`;

function Coin(){
    const [loading, setLoading]=useState(true);
    const [info, setInfo]=useState({});
    const [priceinfo, setPriceinfo]=useState({});
    const {coinId}=useParams<RouteParams>();
    const {state}=useLocation<RouteState>();
    useEffect(()=>{
        (async ()=>{
            const infoData=await(
                await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
            ).json();
            const priceData=await (
                await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
            ).json();
            setInfo(infoData);
            setPriceinfo(priceData);
        })();
    },[]);
    return (
        <Container>
            <Header>
                <Title>{state?.name || "Loading...⌛"}</Title>
            </Header>
            {loading ? <Loader>Loading...⏳</Loader>:null}
        </Container>
    );
}

export default Coin;