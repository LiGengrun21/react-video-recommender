import * as React from 'react';
import Rating from '@mui/material/Rating';
import axios from "axios";

export default function MyScore(props){
  
  //电影平均分
  const [movieScore, setMovieScore] = React.useState(Math.round(props.movieScore*10)/10);
  //用户评分
  const [userScore, setUserScore] = React.useState(props.userScore);
  //用户和电影ID
  const [movieId, setMovieId]=React.useState(props.movieId);
  const [userId, setUserId]=React.useState(props.userId);

  /**
   * 修改用户的个人评分
   */
  const updateRating=async(newScore)=>{
    const data = new FormData();
    data.append("userId",userId)
    data.append("movieId",movieId)
    data.append("score",newScore)
    axios.post("http://localhost:8088/movie/rating",data).
        then((response) => {
          console.log(response.data);
        });
  }

  React.useEffect(()=>{
    if(userScore!=0)
      console.log("用户评分为",userScore)
  },[userScore])

  return(
    <div style={{
      // display:'flex',
      alignItems: "center"}}>
      <strong>
        我的评价：
      </strong>
      <Rating
      size="large"
      value={userScore}
      precision={0.5}
      onChange={(event, newUserScore) => {
        setUserScore(newUserScore);
        updateRating(newUserScore);
      }}/>
      <br/><br/>
      <strong>平均评价：{movieScore}</strong>
    </div>
  );
}