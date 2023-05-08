import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { useNavigate } from 'react-router-dom';

export default function SearchList(props) {

  const itemData=props.movieData;
  const userId=props.userId;

  const navigate=useNavigate() 
  if(itemData==undefined) return (<div>Loading</div>);


   //点击图片，跳转到视频详情页
   const handleClickPic=(event,id)=>{
    console.log(id)//movieId
    navigate("/videoDetail", { state: { movieId: id ,userId:userId}})
  }


  return (
    <ImageList cols={6} rowHeight={300}>
      {itemData.map((item) => (
        <ImageListItem key={item.movieId}>
          <img
            style={{cursor:"pointer"}}
            src={`${item.pictureUrl}?w=248&fit=crop&auto=format`}
            srcSet={`${item.pictureUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={item.movieName}
            loading="lazy"
            onClick={e=>handleClickPic(e,item.movieId)}
          />
          <ImageListItemBar
            title={item.movieName}
            // subtitle={<span>by: {item.author}</span>}
            // position="below"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
