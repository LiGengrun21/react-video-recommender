import MovieList from "../../components/MovieList"
import ImageAvatar from "../../components/ImageAvatars"
import { useLocation } from 'react-router-dom';

function Home(){

    const location = useLocation();
    const { data } = location.state;

    return(
        <div>
            视频系统首页 {data}
            <ImageAvatar/>
            <MovieList/>
        </div>
    )
}

export default Home;