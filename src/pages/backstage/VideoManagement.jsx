import { useLocation } from 'react-router-dom';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MovieIcon from '@mui/icons-material/Movie';
import PersonIcon from '@mui/icons-material/Person';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const columns = [
  { field: 'movieId', headerName: '电影ID', width: 100 },
  { field: 'name', headerName: '电影标题', width: 150 },
  { field: 'actor', headerName: '演员', width: 150 },
  { field: 'director', headerName: '导演', width: 150},
  { field: 'language', headerName: '语言', width: 100},
  { field: 'genre', headerName: '类型', width: 100},
  { field: 'duration', headerName: '时长', width: 100},
  { field: 'shootDate', headerName: '拍摄日期', width: 100},
  { field: 'releaseDate', headerName: '上映日期', width: 100},
  { field: 'description', headerName: '详情', width: 250},
];

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


function VideoManagement(props){
    const location = useLocation();
    const adminId = location.state.adminId;
    const permission=location.state.permission;

    const [movieList, setMovieList]=React.useState();//电影列表
    const [isLoading, setIsLoading] = React.useState(true);//由于数据加载慢，则在axios的finally里判断
    
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

      React.useEffect(() => {

        /**
          * 获取管理员列表
          */
        axios.get("http://localhost:8088/movie/list").
        then((response) => {
          if (response.data.code==0){
            setMovieList(response.data.data)
            console.log("电影列表：",movieList);
          }
          else{
            //code为-1
            console.log("没有电影列表")
          }})
          .catch((error)=>{
            console.log("请求出错",error);
          })
          .finally(()=>{
            setIsLoading(false);
          });
       },[movieList]);
    

    return(
        <div>
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
            基于协同过滤的视频推荐系统 视频管理
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
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <div>
          {isLoading ? (<div>Loading...</div>) : (
            
      <div style={{ height: 550, width: '100%' }}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="success">修改</Button>
          {/* <Button variant="contained" color="primary">修改</Button> */}
        </Stack>
        <br/>
      <DataGrid
          rows={movieList}
          columns={columns}
          getRowId={(row) => row.movieId}
          initialState={{
          pagination: {
          paginationModel: { page: 0, pageSize: 20 },
        },}}
          pageSizeOptions={[20,50,100]}
          checkboxSelection
          />
  </div>
    )}
  </div>
      </Box>
    </Box>
        </div>
    )
}

export default VideoManagement;