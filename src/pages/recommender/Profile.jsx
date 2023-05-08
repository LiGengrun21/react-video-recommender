import { Box, Paper } from "@mui/material";
import { useLocation } from "react-router-dom";
import React from "react";
import { Card, CardContent, Typography, Avatar } from '@mui/material';
// import { makeStyles } from '@mui/styles';
import axios from "axios";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';

const theme = createTheme();

function Profile(){

   //获取首页或其它页面传来的userId
   const location = useLocation();
   const userId = location.state.data;
   console.log("登录用户ID",userId);

   //用户信息
   const [userAvatar,setUserAvatar]=React.useState('') //头像地址
   const [username, setUsername]=React.useState('')
   const [email, setEmail]=React.useState('')
   const [password, setPassword]=React.useState('')
   const [deleted, setDeleted]=React.useState(0)
   const [image, setImage]=React.useState(null) //头像文件

  //邮箱格式判断
  const [isEmailValid, setIsEmailValid] = React.useState(true);

   //用于页面跳转
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    //获取并打印输入的数据
    const data = new FormData(event.currentTarget);
    data.append("userId",userId)
    data.append("deleted",deleted)

    console.log(data.get("email"),data.get("password"),data.get("username"));
 

    //判断新邮箱是否符格式
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (emailRegex.test(email)){
       setIsEmailValid(true);
     }
     else{
       setIsEmailValid(false);
       return;
     }
 
    //不用判断新邮箱是否和其它用户的相同，因为后端实现
    /**
     * 调用修改用户信息的API
     */
    axios.put("http://localhost:8088/user/profile",data).
    then((response) => {
      console.log(response.data);
      if (response.data.code==0){
       setUsername(response.data.data.username)
       setEmail(response.data.data.email)
       setPassword(response.data.data.password)
       setDeleted(response.data.data.deleted)
      }
      else{
        //code为-1
        console.log("用户信息修改失败")
      }});

    /**
     * 调用修改用户头像的API
     */
    
  }

  const handleChangeAvatar=(event)=>{
    const fileData = event.target.files[0];
    const formData = new FormData();
    formData.append('userAvatar', fileData);
    formData.append('userId', userId);
    axios.post('http://localhost:8088/user/profile/upload/avatar', formData)
      .then(response => {
        console.log(response.data);
        if (response.data.code==0){
          setUserAvatar(response.data.data.avatar+"?random="+new Date().getTime());
          console.log(userAvatar)
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleClick=()=>{
    const myinput=document.getElementById("avatar-upload");
    myinput.click();
  }

  React.useEffect(() => {

     /**
       * 根据userId获取用户的所有信息
       */
     axios.get(`http://localhost:8088/user/profile?userId=${userId}`).
     then((response) => {
       console.log(response.data);
       if (response.data.code==0){
        setUserAvatar(response.data.data.avatar+"?random="+new Date().getTime())
        setUsername(response.data.data.username)
        setEmail(response.data.data.email)
        setPassword(response.data.data.password)
       }
       else{
         //code为-1
         console.log("没有拿到用户信息")
       }});
    },[]);


    return(
        <div>
            {!isEmailValid && (
      <Alert severity="error">邮箱格式错误</Alert>
      )}
           <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
           <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              // aria-controls={menuId}
              aria-haspopup="true"
              // onClick={handleProfileMenuOpen}
              color="inherit"
            >
                <label htmlFor="avatar-input">
                  <Avatar sx={{ m: 10, bgcolor: 'secondary.main' }} src={userAvatar} style={{transform: 'scale(4)'}} onClick={handleClick}  >
                    {/* <AddCircleIcon/> */}
                  </Avatar>
                  <input accept="image/*" id="avatar-upload" type="file" onChange={handleChangeAvatar} style={{ display:"none"}}/>
            
                </label>
            </IconButton>
          <Typography component="h1" variant="h5">
            用户个人资料
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="邮箱地址"
              name="email"
              // autoComplete="email"
              // autoFocus
              value={email}
              // InputProps={{
              //   readOnly: true
              // }}
              onChange={(event)=>setEmail(event.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="用户名"
              id="username"
              value={username}
              // InputProps={{
              //   readOnly: true
              // }}
              onChange={(event)=>setUsername(event.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              id="password"
              value={password}
              // InputProps={{
              //   readOnly: true
              // }}
              onChange={(event)=>setPassword(event.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              保存
            </Button>
            <Grid container>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
        </div>
    )
}

export default Profile;