import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import { FormControl } from '@mui/material';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios"
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';


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

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [input, setInput] = React.useState(true);
  const [isEmailValid, setIsEmailValid] = React.useState(true);
  const [correctPassword, setCorrectPassword] = React.useState(true);

  //身份控制
  const [value, setValue] = React.useState("");
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  //用于页面跳转
  const navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault();//防止表单默认行为
    //判断是否3个信息全部输入
    if (email.trim()=='' || password.trim()=='' || value.trim()==''){
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

    //登录接口判断
    if (value=="user"){
      //以用户的身份登录，登录成功后跳转到首页
      console.log("user login");
      axios.get(`http://localhost:8088/user/login?email=${email}&password=${password}`).
      then((response) => {
        console.log(response.data);
        if (response.data.code==0){
          setCorrectPassword(true);
          console.log("userId",response.data.data.userId);
          navigate("/home", { state: { data: response.data.data.userId } })
        }
        else{
          //code为-1
          setCorrectPassword(false);
        }
    });
    }
    else if (value=="admin"){
      //以管理员的身份登录，登录成功后跳转到管理系统dashboard
      console.log("admin login");
      axios.get(`http://localhost:8088/admin/login?email=${email}&password=${password}`).
      then((response) => {
        console.log(response.data);
        if (response.data.code==0){
          setCorrectPassword(true);
          console.log("adminId",response.data.data.adminId);
          navigate("/dashboard", { state: { data: response.data.data.adminId } })
        }
        else{
          //code为-1
          setCorrectPassword(false);
        }
    });
    }
    else{
      return;
    }

    // //登录接口
    // axios.post('http://localhost:8088/login', { email, password })
    //   .then(response => {
    //     // 登录成功，处理响应数据
    //     console.log(response.data);
    //   })
    //   .catch(error => {
    //     // 登录失败，处理错误信息
    //     console.error(error);
    //   });
  };

 

  return (
    <div>
       {!input && (
      <Alert severity="error">请填写全部信息</Alert>
      )}
      {!isEmailValid && (
      <Alert severity="error">邮箱格式错误</Alert>
      )}
      {!correctPassword && (
      <Alert severity="error">密码错误，请重新输入</Alert>
      )}

<ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(http://localhost:8099/loginBg/login.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              视频推荐系统
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                name="password"
                label="密码"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(event)=>setPassword(event.target.value)}
              />
              {/* 身份选择 */}
             <FormControl component="fieldset">
                <RadioGroup value={value} onChange={handleChange}>
                    <FormControlLabel value="admin" control={<Radio />} label="管理员" />
                    <FormControlLabel value="user" control={<Radio />} label="用户" />
                </RadioGroup>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  {/* <Link href="#" variant="body2">
                    Forgot password?
                  </Link> */}
                </Grid>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"没有账户? 点这里注册"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
    </div>
   
    
  );
}

export default Login;