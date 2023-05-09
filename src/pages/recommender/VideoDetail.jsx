import { useLocation } from "react-router-dom";
import * as React from 'react';
import axios from "axios";
import PrimarySearchAppBar from "../../components/PrimarySearchAppBar";
import Grid from '@mui/material/Grid';
import { Card, CardContent, CardMedia } from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CommentSection from "../../components/CommentSection";
import MyScore from "../../components/MyScore";

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

    //电影平均分
    const [movieScore, setMovieScore]=React.useState()
    
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

        /**
        * 根据userId和movieId获取平均分
        */
        axios.get(`http://localhost:8088/movie/rating?movieId=${movieId}`).
        then((response) => {
          console.log(response.data);
          if (response.data.code==0){
            setMovieScore(response.data.data)
          }
          else{
            //code为-1
            setMovieScore()
          }});

       
       },[videoUrl]);


    return(
        <div>
            视频详情页 {movieId} {userId} {videoUrl}

            <PrimarySearchAppBar userAvatar={userAvatar} username={username} userId={userId}/>
            <Grid container spacing={2}>
                <Grid item xs={0.2}/>
                <Grid item xs={6.3}>
                {videoUrl && (
                    <video controls width="750" height="420">
                        <source src={videoUrl}/>
                    </video>
                )}
                {movieScore && <MyScore movieScore={movieScore}/>}
                
                </Grid>
                <Grid item xs={5.5}>
                    <br/>
                    <h1>{movieName}</h1> <br />
                    <strong>导演：</strong>{director}<br/><br/>
                    <strong>主演：</strong>{actor}<br/><br/>
                    <strong>类型：</strong>{genre}<br/><br/>
                    <strong>语言：</strong>{language}<br/><br/>
                    <strong>拍摄日期：</strong>{shootDate}<br/><br/>
                    <strong>上映日期：</strong>{releaseDate}<br/><br/>
                    <strong>电影时长：</strong>{duration}<br/><br/>
                    <strong>简介：</strong>{description} <br/><br/>
                </Grid>
                {/* <CommentSection/> */}
            </Grid>
        </div>
    )
}

export default VideoDetail