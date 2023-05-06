import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

export default function MovieList(props) {
  const itemData=props.movieData;
  if(itemData==undefined) return (<div>Loading</div>);
  return (
    <ImageList sx={{ height: 250 }} cols={6}>
      {itemData.map((item) => (
        <ImageListItem key={item.movieId}>
          <img
            src={`${item.pictureUrl}?w=248&fit=crop&auto=format`}
            srcSet={`${item.pictureUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={item.movieName}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.movieName}
            // subtitle={<span>by: {item.author}</span>}
            position="below"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
