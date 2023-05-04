import MovieList from "../../components/MovieList"
import ImageAvatar from "../../components/ImageAvatars"
import { useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid';
// import SearchBar from "../../components/SearchBar";

function Home(){

    const location = useLocation();
    const { data } = location.state;

    return(
        <div>
            视频系统首页 {data}
            <ImageAvatar/>
            <Grid container>
                <Grid item xs={0.5}></Grid>
                <Grid item xs={11}>
                    <MovieList xxx={itemData2}/>
                </Grid>
                <Grid item xs={0.5}></Grid>
            </Grid>
{/* 
            <SearchBar/> */}
        </div>
    )
}

export default Home;


const itemData2 = {
  data:[
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    author: '@bkristastucchio',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    author: '@rollelflex_graphy726',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
    author: '@helloimnik',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    author: '@nolanissac',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    author: '@hjrc33',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
  },
]};