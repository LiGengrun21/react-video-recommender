import MovieList from "../../components/MovieList"
import ImageAvatar from "../../components/ImageAvatars"
import { useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid';

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
                    <MovieList/>
                </Grid>
                <Grid item xs={0.5}></Grid>
            </Grid>
        </div>
    )
}

export default Home;