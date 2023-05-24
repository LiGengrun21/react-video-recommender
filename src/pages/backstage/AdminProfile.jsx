import { useLocation } from 'react-router-dom';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MovieIcon from '@mui/icons-material/Movie';
import PersonIcon from '@mui/icons-material/Person';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';
import { Typography, Avatar } from '@mui/material';
import axios from "axios";
import Alert from '@mui/material/Alert';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


function AdminProfile(props){
    const location = useLocation();
    const adminId = location.state.adminId;
    const permission=location.state.permission;

    //管理员信息
    const [adminAvatar,setAdminAvatar]=React.useState('') //头像地址
    const [adminName, setAdminName]=React.useState('')
    const [email, setEmail]=React.useState('')
    const [password, setPassword]=React.useState('')
    const [deleted, setDeleted]=React.useState(0)
    const [image, setImage]=React.useState(null) //头像文件
    //邮箱格式判断
    const [isEmailValid, setIsEmailValid] = React.useState(true);

    
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
      setOpen(true);
    };
    const handleDrawerClose = () => {
      setOpen(false);
    };

    const navigate = useNavigate();

    const handleDashBoardClick = () => {
        navigate("/dashboard", { state: { adminId: adminId, permission: permission } })
    };

    const handleUserClick = () => {
        navigate("/userManagement", { state: { adminId: adminId, permission: permission } })
    };
    
    const handleAdminClick = () => {
        navigate("/adminManagement", { state: { adminId: adminId, permission: permission } })
      };
    
    const handleProfileClick = () => {
        navigate("/adminProfile", { state: { adminId: adminId, permission: permission } })
    };

    const handleVideoClick = () => {
        navigate("/videoManagement", { state: { adminId: adminId, permission: permission } })
      };
    
    const handleLogoutClick = () => {
        navigate("/login")
      };
    
  
      const handleSubmit = (event) => {
        event.preventDefault();
    
        //获取并打印输入的数据
        const data = new FormData(event.currentTarget)
        data.append("adminId",adminId)
        data.append("deleted",deleted)
        data.append("avatar",adminAvatar)
        data.append("permission",permission)
    
        console.log(data.get("email"),data.get("password"),data.get("adminName"));
     
    
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
         * 调用修改管理员信息的API
         */
        axios.put("http://localhost:8088/admin/adminId",data).
        then((response) => {
          console.log(response.data);
          if (response.data.code==0){
           setAdminName(response.data.data.adminName)
           setEmail(response.data.data.email)
           setPassword(response.data.data.password)
           setDeleted(response.data.data.deleted)
          }
          else{
            //code为-1
            console.log("管理员信息修改失败")
          }});
        
      }

      const handleChangeAvatar=(event)=>{
        const fileData = event.target.files[0];
        const formData = new FormData();
        formData.append('adminAvatar', fileData);
        formData.append('adminId', adminId);
        axios.post('http://localhost:8088/admin/upload/avatar', formData)
          .then(response => {
            console.log(response.data);
            if (response.data.code==0){
              setAdminAvatar(response.data.data.avatar+"?random="+new Date().getTime());
              console.log(adminAvatar)
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
          * 根据adminId获取用户的所有信息
          */
        axios.get(`http://localhost:8088/admin/existed/adminId?adminId=${adminId}`).
        then((response) => {
          console.log(response.data);
          if (response.data.code==0){
           setAdminAvatar(response.data.data.avatar+"?random="+new Date().getTime())
           setAdminName(response.data.data.adminName)
           setEmail(response.data.data.email)
           setPassword(response.data.data.password)
          }
          else{
            //code为-1
            console.log("没有拿到管理员信息")
          }});
       },[]);
    

    return(
        <div>
             {!isEmailValid && (
      <Alert severity="error">邮箱格式错误</Alert>
      )}
            <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            基于协同过滤的视频推荐系统 个人资料
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
           <ListItem  disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={handleDashBoardClick}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                 <DashboardCustomizeIcon/>
                </ListItemIcon>
                <ListItemText primary={"控制台"} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>

            <ListItem  disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                  onClick={handleUserClick}
                >
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={"用户管理"} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>

            <ListItem  disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}

                  onClick={handleVideoClick}
                >
                  <MovieIcon />
                </ListItemIcon>
                <ListItemText primary={"视频管理"} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>

            {(adminId==1) && (
               <ListItem  disablePadding sx={{ display: 'block' }}>
               <ListItemButton
                 sx={{
                   minHeight: 48,
                   justifyContent: open ? 'initial' : 'center',
                   px: 2.5,
                 }}
               >
                 <ListItemIcon
                   sx={{
                     minWidth: 0,
                     mr: open ? 3 : 'auto',
                     justifyContent: 'center',
                   }}
 
                   onClick={handleAdminClick}
                 >
                   <SupervisorAccountIcon/>
                 </ListItemIcon>
                 <ListItemText primary={"管理员管理"} sx={{ opacity: open ? 1 : 0 }} />
               </ListItemButton>
             </ListItem>
      )}

            <ListItem  disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}

                  onClick={handleProfileClick}
                >
                  <AccountBoxIcon/>
                </ListItemIcon>
                <ListItemText primary={"个人资料"} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>

            <ListItem  disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                  onClick={handleLogoutClick}
                >
                  <LogoutIcon/>
                </ListItemIcon>
                <ListItemText primary={"退出登录"} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
        </List>
      </Drawer>
      </Box>


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
                  <Avatar sx={{ m: 10, bgcolor: 'secondary.main' }} src={adminAvatar} style={{transform: 'scale(4)'}} onClick={handleClick}  >
                  
                  </Avatar> 
                  <input accept="image/*" id="avatar-upload" type="file" onChange={handleChangeAvatar} style={{ display:"none"}}/>
            
                </label>
            </IconButton>
          <Typography component="h1" variant="h5">
            管理员个人资料
          </Typography>
          <Box component="form"  onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              name="adminName"
              label="账户名"
              id="adminName"
              value={adminName}
              // InputProps={{
              //   readOnly: true
              // }}
              onChange={(event)=>setAdminName(event.target.value)}
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
    </div>
    )
}

export default AdminProfile;