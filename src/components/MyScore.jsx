import * as React from 'react';
import Rating from '@mui/material/Rating';

export default function MyScore(props){
  
  //电影平均分
  const [movieScore, setMovieScore] = React.useState(Math.round(props.movieScore*10)/10);
  //用户评分
  const [userScore, setUserScore] = React.useState(props.userScore);

  React.useEffect(()=>{
    if(userScore!=0)
      console.log("用户评分为",userScore)
  },[userScore])

  return(
    <div style={{
      display:'flex',
      alignItems: "center"}}>
      <Rating
      size="large"
      value={userScore}
      precision={0.5}
      onChange={(event, newUserScore) => {
        setUserScore(newUserScore);
      }}/>
      &nbsp;&nbsp; {movieScore}
      {/* <br/>用户评分为{userScore} */}
    </div>
  );
}