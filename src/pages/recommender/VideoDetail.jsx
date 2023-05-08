import { useLocation } from "react-router-dom";

function VideoDetail(){
    //获取首页或其它页面传来的userId
    const location = useLocation();
    const movieId = location.state.movieId;
    const userId=location.state.userId;
    console.log("视频ID",movieId,"用户ID",userId);

    return(
        <div>
            视频详情页 {movieId} {userId}
        </div>
    )
}

export default VideoDetail