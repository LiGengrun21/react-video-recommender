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
  const handleSubmit = (event) => {
    event.preventDefault();

    if (password === rePassword) {
      // 密码匹配
      setPasswordsMatch(true);
      // 在此处执行登录逻辑
    } else {
      // 密码不匹配，显示错误信息
      setPasswordsMatch(false);
    }

    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

const [password, setPassword] = React.useState("");
const [rePassword, setRePassword] = React.useState("");
const [passwordsMatch, setPasswordsMatch] = React.useState(true);


  return (
    <div>
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
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="username"
              label="用户名"
              id="username"
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