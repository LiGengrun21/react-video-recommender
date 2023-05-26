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
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const columns = [
  { field: 'movieId', headerName: '电影ID', width: 100 },
  { field: 'name', headerName: '电影标题', width: 150 },
  { field: 'actor', headerName: '演员', width: 150 },
  { field: 'director', headerName: '导演', width: 150},
  { field: 'language', headerName: '语言', width: 100},
  { field: 'genre', headerName: '类型', width: 100},
  { field: 'duration', headerName: '时长', width: 100},
  { field: 'shootDate', headerName: '拍摄日期', width: 100},
  { field: 'releaseDate', headerName: '上映日期', width: 120},
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

    /**
     * 电影信息
     */
    const [movieId, setMovieId]=React.useState(0)
    const [movieName, setMovieName]=React.useState('')
    const [description, setDescription]=React.useState('')
    const [duration, setDuration]=React.useState('')
    const [releaseDate, setReleaseDate]=React.useState('')
    const [shootDate, setShootDate]=React.useState('')
    const [language, setLanguage]=React.useState('')
    const [genre, setGenre]=React.useState('')
    const [actor, setActor]=React.useState('')
    const [director, setDirector]=React.useState('')
    const [video, setVideo]=React.useState('')
    const [picture, setPicture]=React.useState('')

     /**
     * 控制更新按钮
     */
     const [update, setUpdate]=React.useState(false)

     /**
     * 选定的行
     */
     const [selectedRows, setSelectedRows] = React.useState([]);

     const handleSelectionModelChange = (newSelection) => {
       setSelectedRows(newSelection);
     };

      //点击更新按钮打开模态框
     const handleClickUpdate=()=>{
      //根据选中的row获得对应的信息
      if (selectedRows.length!=1){
        alert("每次请选择一条数据更新")
        return;
      }
      console.log("选中的row",selectedRows[0])
      //调用API根据userId获取数据
      axios.get(`http://localhost:8088/movie/info?movieId=${selectedRows[0]}`).
        then((response) => {
          if (response.data.code==0){
            setMovieId(response.data.data.movieId)
            setMovieName(response.data.data.name)
            setDescription(response.data.data.description)
            setDuration(response.data.data.duration)
            setDirector(response.data.data.director)
            setActor(response.data.data.actor)
            setLanguage(response.data.data.language)
            setPicture(response.data.data.picture)
            setVideo(response.data.data.video)
            setGenre(response.data.data.genre)
            setReleaseDate(response.data.data.releaseDate)
            setShootDate(response.data.data.shootDate)
          }
          else{
            //code为-1
            console.log("没有获取到这个电影")
          }})
      setUpdate(true)
    }

     //关闭更新模态框
     const handleCloseUpdate=()=>{
      setUpdate(false)
    }

     //更新表单提交
     const handleSubmitUpdate=(event)=>{
      event.preventDefault();
      const data = new FormData();
      data.append("movieId",movieId)
      data.append("name",movieName)
      data.append("description",description)
      data.append("duration",duration)
      data.append("actor",actor)
      data.append("director",director)
      data.append("shootDate",shootDate)
      data.append("releaseDate",releaseDate)
      data.append("genre", genre)
      data.append("picture",picture)
      data.append("video",video)
      data.append("language",language)

      axios.put("http://localhost:8088/movie/info",data).
      then((response) => {
        console.log(response.data);
    });
      //关闭模态框
      setUpdate(false);
      window.location.reload(); //页面刷新
    }

    /**
     * 处理图片上传
     */
    const handleChangePicture=(event)=>{
      const fileData = event.target.files[0];
      const formData = new FormData();
      formData.append('moviePicture', fileData);
      formData.append('movieId', movieId);
      axios.post('http://localhost:8088/movie/picture', formData)
        .then(response => {
          console.log(response.data);
          if (response.data.code==0){
            setPicture(response.data.data.picture)
            console.log(picture)
          }
        })
        .catch(error => {
          console.log(error);
        });
    }

    /**
     * 处理视频上传
     */
    const handleChangeVideo=(event)=>{
      const fileData = event.target.files[0];
      const formData = new FormData();
      formData.append('movieVideo', fileData);
      formData.append('movieId', movieId);
      axios.post('http://localhost:8088/movie/video', formData)
        .then(response => {
          console.log(response.data);
          if (response.data.code==0){
            setVideo(response.data.data.video)
            console.log(video)
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  
    
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
          <Button variant="contained" color="success" onClick={handleClickUpdate}>修改</Button>
          <Dialog open={update} onClose={handleCloseUpdate}>
             <form onSubmit={handleSubmitUpdate}>
             <DialogTitle>更新电影信息</DialogTitle>
              <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="标题"
                fullWidth
                variant="standard"
                value={movieName}
                onChange={(event)=>setMovieName(event.target.value)}
                />
                <TextField
                margin="dense"
                id="director"
                label="导演"
                fullWidth
                variant="standard"
                value={director}
                onChange={(event)=>setDirector(event.target.value)}
                />
                <TextField
                margin="dense"
                id="actor"
                label="演员"
                fullWidth
                variant="standard"
                multiline
                value={actor}
                onChange={(event)=>setActor(event.target.value)}
                />
                <TextField
                margin="dense"
                id="genre"
                label="类型"
                fullWidth
                variant="standard"
                value={genre}
                onChange={(event)=>setGenre(event.target.value)}
                />
                <TextField
                margin="dense"
                id="duration"
                label="时长"
                fullWidth
                variant="standard"
                value={duration}
                onChange={(event)=>setDuration(event.target.value)}
                />
                <TextField
                margin="dense"
                id="language"
                label="语言"
                fullWidth
                variant="standard"
                value={language}
                onChange={(event)=>setLanguage(event.target.value)}
                />
                <TextField
                margin="dense"
                id="releaseDate"
                label="发行日期"
                fullWidth
                variant="standard"
                value={releaseDate}
                onChange={(event)=>setReleaseDate(event.target.value)}
                />
                <TextField
                margin="dense"
                id="shootDate"
                label="拍摄日期"
                fullWidth
                variant="standard"
                value={shootDate}
                onChange={(event)=>setShootDate(event.target.value)}
                />
                <TextField
                margin="dense"
                id="description"
                label="简介"
                fullWidth
                variant="standard"
                multiline
                value={description}
                onChange={(event)=>setDescription(event.target.value)}
                />
                <br/><br/>
                <strong>上传图片：</strong>
                <label htmlFor="picture-input">
                  <img src={picture}  style={{ width: '500px'}}></img>
                  <input accept="image/*" id="picture-upload" type="file" onChange={handleChangePicture}/>
                </label>
               
                <br/><br/>
                <strong>上传视频：</strong>
                <label htmlFor="video-input">
                  <video src={video} style={{ width: '500px'}}></video>
                  <input accept="video/*" id="video-upload" type="file" onChange={handleChangeVideo}/>
                </label>
               

            </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUpdate}>取消</Button>
                    <Button type='submit'>提交</Button>
                </DialogActions>
             </form>
          </Dialog>
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
          onRowSelectionModelChange={handleSelectionModelChange}
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