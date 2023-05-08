import { Box, Paper } from "@mui/material";
import PrimarySearchAppBar from "../../components/PrimarySearchAppBar";
import * as React from 'react';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import SearchList from "../../components/SearchList";


function Search(){
  
  const { state } = useLocation();
  const { userId, searchValue } = state || {}; // 解构state对象，避免state为undefined时报错
  console.log("搜索框传来的两个值",userId,searchValue);

  //搜索结果
  const [searchResults, setSearchResults]=React.useState();

  //用户名和头像
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
     * 调用模糊搜索API
     */
    axios.get(`http://localhost:8088/movie/search?movieName=${searchValue}`).
    then((response) => {
      console.log(response.data);
      if (response.data.code==0){
        setSearchResults(response.data.data)
      }
      else{
        //code为-1
        console.warn("模糊搜索失败")
        setSearchResults()
      }});

    },[searchValue]);

    return(
        <div style={{height:"100vh",backgroundColor: '#000000'}}>
          <Paper style={{ backgroundColor: '#000000' }}>
            <PrimarySearchAppBar userAvatar={userAvatar} username={username} userId={userId}/>
            <SearchList movieData={searchResults} userId={userId}/>
          </Paper>
        </div>
    )
}

export default Search;