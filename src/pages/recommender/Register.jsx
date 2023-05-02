import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">
        李庚润
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

function Register() {
  const [password, setPassword] = React.useState("");
  const [rePassword, setRePassword] = React.useState("");
  const [passwordsMatch, setPasswordsMatch] = React.useState(true);

  const [email, setEmail] = React.useState("");
  const [isEmailValid, setIsEmailValid] = React.useState(true);

  const [username, setUsername] = React.useState("");
  const [input, setInput] = React.useState(true);

  //用于页面跳转
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    
    //获取并打印输入的数据
    const data = new FormData(event.currentTarget);
    console.log(data);

    //判断是否4个field全部输入
    if (username.trim()=='' || email.trim()=='' || password.trim()=='' || rePassword.trim()==''){
      setInput(false); //存在未输入的field
      return;
    }
    else{
      setInput(true); //全部输入
    }

    //判断邮箱是否符合格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)){
      setIsEmailValid(true);
    }
    else{
      setIsEmailValid(false);
      return;
    }

    //判断两次密码输入是否相同
    if (password === rePassword) {
      // 密码匹配
      setPasswordsMatch(true);
    } else {
      // 密码不匹配，显示错误信息
      setPasswordsMatch(false);
      return;
    }

    axios.post("http://localhost:8088/user/register",data).
      then((response) => {
        console.log(response.data);
        navigate("/login")
    });
  };

  return (
    <div>
      {!input && (
      <Alert severity="error">请填写全部信息</Alert>
      )}
      {!isEmailValid && (
      <Alert severity="error">邮箱格式错误</Alert>
      )}
      {!passwordsMatch && (
      <Alert severity="error">密码不匹配，请重新输入</Alert>
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <AddCircleIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            用户注册
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="邮箱地址"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(event)=>setEmail(event.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="用户名"
              id="username"
              onChange={(event)=>setUsername(event.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              type="password"
              id="password"
              value={password}
              onChange={(event)=>setPassword(event.target.value)}
              autoComplete="current-password"
            />
             <TextField
              margin="normal"
              required
              fullWidth
              name="Repassword"
              label="确认密码"
              type="password"
              id="Repassword"
              value={rePassword}
              onChange={(event)=>setRePassword(event.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
    </div>
  );
}

export default Register;