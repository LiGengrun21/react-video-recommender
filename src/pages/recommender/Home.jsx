import MovieList from "../../components/MovieList"
import ImageAvatar from "../../components/ImageAvatars"
import { useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import SearchBar from "../../components/SearchBar";
import PrimarySearchAppBar from "../../components/PrimarySearchAppBar";
import { Box, Paper } from "@mui/material";
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import * as React from 'react';

function Home(){
    
    //获取登录页面传来的userId
    const location = useLocation();
    const userId = location.state.data;
    console.log("登录用户ID",userId);

    const [mostViewedData, setMostViewedData]=React.useState()
    const [topRatedData, setTopRatedData]=React.useState()
    const [cfData, setCfData]=React.useState()

  
    const [userAvatar,setUserAvatar]=React.useState('');
    const [username, setUsername]=React.useState('');

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
       * 获取最多评价的六部电影
       */
      axios.get("http://localhost:8088/movie/recommendation/mostViewed").
      then((response) => {
        if (response.data.code==0){
          console.log("mostViewed",response.data)
          setMostViewedData(response.data.data);
        }
        else{
          //code为-1
          console.warn("最多评价获取失败")
        }});
  
      /**
       * 根据userId获取6个个性化推荐数据
       */
      axios.get(`http://localhost:8088/movie/recommendation/cf?userId=${userId}`).
      then((response) => {
        console.log(response.data);
        if (response.data.code==0){
          setCfData(response.data.data);
        }
        else{
          //code为-1
          console.warn("cf数据获取失败")
        }});

        /**
         * 获得最高分的六部电影
         */
        axios.get("http://localhost:8088/movie/recommendation/topRated").
        then((response) => {
          console.log("topRated",response.data)
          if (response.data.code==0){
            setTopRatedData(response.data.data);
          }
          else{
            //code为-1
            console.warn("最高分获取失败")
          }});

    },[]);

    return(
        <div>
          <Paper style={{ backgroundColor: '#000000' }}>
          <PrimarySearchAppBar userAvatar={userAvatar} username={username} userId={userId}/>
          <Box height={"50px"}></Box>
          <Grid container >
              <Grid item xs={0.5}></Grid>
              <Grid item xs={11}>
                <Typography variant="h7" color="primary" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }} style={{ fontWeight: 'bold' }}>
                    个性化推荐影片
                </Typography><br/>
              </Grid>
              <Grid item xs={0.5}></Grid>
          </Grid>
            <Grid container>
                <Grid item xs={0.5}></Grid>
                <Grid item xs={11}>
                    <MovieList movieData={cfData} userId={userId}/>
                </Grid>
                <Grid item xs={0.5}></Grid>
            </Grid>

            {/* <Grid container>
              <Grid item xs={0.5}></Grid>
              <Grid item xs={11}>
                <Typography variant="h7" color="primary" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }} style={{ fontWeight: 'bold' }}>
                    最近热门的影片
                </Typography>
              </Grid>
              <Grid item xs={0.5}></Grid>
          </Grid>
            <Grid container>
                <Grid item xs={0.5}></Grid>
                <Grid item xs={11}>
                    <MovieList xxx={itemData2}/>
                </Grid>
                <Grid item xs={0.5}></Grid>
            </Grid> */}

            <Grid container>
              <Grid item xs={0.5}></Grid>
              <Grid item xs={11}>
                <Typography variant="h7" color="primary" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }} style={{ fontWeight: 'bold' }}>
                    高分影片
                </Typography>
              </Grid>
              <Grid item xs={0.5}></Grid>
          </Grid>
            <Grid container>
                <Grid item xs={0.5}></Grid>
                <Grid item xs={11}>
                    <MovieList movieData={topRatedData} userId={userId}/>
                </Grid>
                <Grid item xs={0.5}></Grid>
            </Grid>

            <Grid container>
              <Grid item xs={0.5}></Grid>
              <Grid item xs={11}>
                <Typography variant="h7" color="primary" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }} style={{ fontWeight: 'bold' }}>
                    热门影片
                </Typography>
              </Grid>
              <Grid item xs={0.5}></Grid>
          </Grid>
            <Grid container>
                <Grid item xs={0.5}></Grid>
                <Grid item xs={11}>
                    <MovieList movieData={mostViewedData} userId={userId}/>
                </Grid>
                <Grid item xs={0.5}></Grid>
            </Grid>
            {/* <SearchBar/> */}
            视频系统首页 {userId}
          </Paper>
          
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