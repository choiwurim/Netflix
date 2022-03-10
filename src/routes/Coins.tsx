import styled from "styled-components";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";

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

const CoinsList=styled.ul`
`;

const Coin=styled.li`
background-color:#cd84f1;
color:${(props)=>props.theme.bgColor};
maring-bottom:20px;
border-radius:15px;
a{
    display:flex;
    padding:20px;
    transition: color 0.2s ease-in;
    align-items:center;
}
&:hover{
    a{
        color:#f7f1e3;
    }
}
`;

const Loader=styled.span`
text-align:center;
display:block;
`;

const Img=styled.img`
width:25px;
height:25px;
margin-right:10px;
`

interface CoinInterface{
    "id":string,"name":string,"symbol":string,"rank":number,"is_new":boolean,"is_active":boolean,"type":string
}

const Title=styled.div`
font-size:30px;
color:${(props)=>props.theme.accentColor};
`;

function Coins(){
    const [coins, setCoins]=useState<CoinInterface[]>([]);
    const [loading, setLoading]=useState(true);
    useEffect(()=>{
        (async()=>{
            const response=await fetch("https://api.coinpaprika.com/v1/coins");
            const json=await response.json();
            setCoins(json.slice(0,10));
            setLoading(false);
        })();
    },[]);
    return (
    <Container>
        <Header>
            <Title>Coins🪙</Title>
        </Header>
        {loading ? (
            <Loader>Loading...⏳</Loader>
        ):(
            <CoinsList>
                {coins.map((coin)=>(
                    <Coin key={coin.id}>
                        <Link to={{
                            pathname:`/${coin.id}`,
                            state:{name:coin.name},
                        }}>
                        <Img 
                            src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                        />
                        {coin.name} &rarr;
                        </Link>
                    </Coin>
                ))}
            </CoinsList>
        )}
    </Container>);
}

export default Coins;