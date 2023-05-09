import { useLocation } from "react-router-dom";
import { JolPlayer } from "jol-player";
import * as React from 'react';
import axios from "axios";
import PrimarySearchAppBar from "../../components/PrimarySearchAppBar";
import Grid from '@mui/material/Grid';
import { Card, CardContent, CardMedia } from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CommentSection from "../../components/CommentSection";


function VideoDetail(){
    //获取首页或其它页面传来的userId
    const location = useLocation();
    const movieId = location.state.movieId;
    const userId=location.state.userId;
    console.log("视频ID",movieId,"用户ID",userId);

    //用户名和头像
    const [userAvatar,setUserAvatar]=React.useState('');
    const [username, setUsername]=React.useState('');

    //电影信息
    const [movieName, setMovieName]=React.useState('')
    const [description, setDescription]=React.useState('')
    const [duration, setDuration]=React.useState('')
    const [releaseDate, setReleaseDate]=React.useState('')
    const [shootDate, setShootDate]=React.useState('')
    const [language, setLanguage]=React.useState('')
    const [genre, setGenre]=React.useState('')
    const [actor, setActor]=React.useState('')
    const [director, setDirector]=React.useState('')
    const [videoUrl, setVideoUrl]=React.useState('')
    // const [pictureUrl, setPictureUrl]=React.useState('')
    
    React.useEffect(() => {

        /**
          * 根据userId获取用户头像和用户名
          */
        axios.get(`http://localhost:8088/user/profile?userId=${userId}`).
        then((response) => {
          console.log(response.data);
          if (response.data.code==0){
            // console.log("用户头像地址",response.data.data.avatar,"用户名",response.data.data.username);
            setUserAvatar(response.data.data.avatar+"?random="+new Date().getTime())
            setUsername(response.data.data.username)
          }
          else{
            //code为-1
            setUserAvatar("http://localhost:8099/userAvatars/default.jpg")
            setUsername("John Doe")
          }});

          
        /**
         * 根据movieId获取电影信息
         */
        axios.get(`http://localhost:8088/movie/info?movieId=${movieId}`).
        then((response) => {
        console.log(response.data);
        if (response.data.code==0){
            setMovieName(response.data.data.name)
            setDescription(response.data.data.description)
            setDuration(response.data.data.duration)
            setReleaseDate(response.data.data.releaseDate)
            setShootDate(response.data.data.shootDate)
            setLanguage(response.data.data.language)
            setGenre(response.data.data.genre)
            setActor(response.data.data.actor)
            setDirector(response.data.data.director)
            setVideoUrl(response.data.data.video)
            // setPictureUrl(response.data.data.picture)
            console.log("视频地址1",response.data.data.video)
            console.log("视频地址2",videoUrl)
            // console.log("图片地址",pictureUrl)
        }
        else{
          //code为-1
          console.log("没找到视频资源")
        }})
        .catch(error => {
            console.log(error);
        });

       
       },[videoUrl]);


    return(
        <div>
            视频详情页 {movieId} {userId} {videoUrl}

            <PrimarySearchAppBar userAvatar={userAvatar} username={username} userId={userId}/>
            <Grid container spacing={2}>
                <Grid item xs={6.5}>
                {/* <JolPlayer option={{
                    videoSrc: videoUrl, //视频资源存在nginx里
                    width: 750,
                    height: 420,
                    autoPlay: true,
                }}/> */}
                {videoUrl && (
                    <video controls width="750" height="420">
                        <source src={videoUrl}/>
                    </video>
                )}
                </Grid>
                <Grid item xs={5.5}>
                    {movieName} <br />
                    导演：{director}<br/>
                    主演：{actor}<br/>
                    类型：{genre}<br/>
                    语言：{language}<br/>
                    拍摄日期：{shootDate}<br/>
                    上映日期：{releaseDate}<br/>
                    电影时长：{duration}<br/>
                    简介：{description} <br/>
                </Grid>
                {/* <CommentSection/> */}
            </Grid>
        </div>
    )
}

export default VideoDetail