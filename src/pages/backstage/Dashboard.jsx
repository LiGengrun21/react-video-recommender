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
import { Grid } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import PersonIcon from '@mui/icons-material/Person';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import axios from "axios";
import CardMedia from '@mui/material/CardMedia';
import { BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts';
import Paper from '@mui/material/Paper';


const data1 = [
  { name: 'A', value: 10 },
  { name: 'B', value: 20 },
  { name: 'C', value: 30 },
  { name: 'D', value: 40 },
];

const ageData=[
  { name: '小于10', value: 0.09 },
  { name: '10~20', value: 0.2 },
  { name: '20~30', value: 0.34 },
  { name: '30~40', value: 0.26 },
  { name: '40~50', value: 0.1 },
  { name: '大于50', value: 0.01 },
]

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042','#FFC0CB','#00F49F'];

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


function Dashboard(props){
    const location = useLocation();
    const adminId = location.state.adminId;
    const permission=location.state.permission;

    const [adminNum, setAdminNum]=React.useState(0);
    const [userNum, setUserNum]=React.useState(0);
    const [movieNum, setMovieNum]=React.useState(0);
    const [ratingNum, setRatingNum]=React.useState(0);

    const [adminAvatar,setAdminAvatar]=React.useState('') //头像地址
    const [adminName, setAdminName]=React.useState('')
    const [email, setEmail]=React.useState('')

    const [mostViewedData, setMostViewedData]=React.useState()
    const [scoreDistribution, setScoreDistribution]=React.useState()
    
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
          * 获取管理员数量
          */
        axios.get("http://localhost:8088/admin//number/admin").
        then((response) => {
          console.log(response.data);
          if (response.data.code==0){
            setAdminNum(response.data.data)
          }
          else{
            //code为-1
            console.log("没有数量信息")
          }});

        /**
         * 获取用户数量
         */
        axios.get("http://localhost:8088/admin//number/user").
        then((response) => {
          console.log(response.data);
          if (response.data.code==0){
            setUserNum(response.data.data)
          }
          else{
            //code为-1
            console.log("没有数量信息")
          }});


        /**
         * 获取评价数量
         */
        axios.get("http://localhost:8088/admin//number/rating").
        then((response) => {
          console.log(response.data);
          if (response.data.code==0){
            setRatingNum(response.data.data)
          }
          else{
            //code为-1
            console.log("没有数量信息")
          }});

        /**
         * 获取电影数量
         */
        axios.get("http://localhost:8088/admin//number/movie").
        then((response) => {
          console.log(response.data);
          if (response.data.code==0){
            setMovieNum(response.data.data)
          }
          else{
            //code为-1
            console.log("没有数量信息")
          }});

        
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
          }
          else{
            //code为-1
            console.log("没有拿到管理员信息")
          }});

        
      /**
       * 获取最多评价的六部电影
       */
      axios.get("http://localhost:8088/admin/mostRated").
      then((response) => {
        if (response.data.code==0){
          console.log("mostViewed",response.data.data)
          setMostViewedData(response.data.data);
        }
        else{
          //code为-1
          console.warn("最多评价的20个电影获取失败")
        }});

      /**
       * 各个区间的评分数量
       */
      axios.get("http://localhost:8088/admin/topRated").
      then((response) => {
        if (response.data.code==0){
          console.log("评分分布",response.data.data)
          setScoreDistribution(response.data.data)
        }
        else{
          //code为-1
          console.warn("评分数量分布获取失败")
        }});

       },[]);
    

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
            基于协同过滤的视频推荐系统 管理后台
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
        <Card sx={{ maxWidth: 345, marginTop: '42px' }}>
      <CardMedia
        sx={{ height: 140 }}
        image={adminAvatar}
        title="admin profile"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {adminName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          权限: {permission?"超级管理员":"普通管理员"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          邮箱地址: {email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {permission?"超级管理员可以进行用户管理、视频管理以及权限管理":"普通管理员可以进行用户管理和视频管理"}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">详情</Button>
      </CardActions>
    </Card>
        <Grid container spacing={5} >
  <Grid item>
    <Box>
    <Card sx={{ minWidth: 250, marginTop: '50px', background: 'linear-gradient(to right, #ffcc00, #ff3300)'}}>
      <CardContent>
        <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
          用户
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {userNum}个
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate("/userManagement", { state: { adminId: adminId, permission: permission } })}>查看详情</Button>
      </CardActions>
    </Card>
    </Box>
  </Grid>
  <Grid item>
    <Box>
    <Card sx={{ minWidth: 250, marginTop: '50px',background: 'linear-gradient(to right, #8a2be2, #0000ff)'}}>
      <CardContent>
        <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
          电影
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {movieNum}个
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate("/videoManagement", { state: { adminId: adminId, permission: permission } })}>查看详情</Button>
      </CardActions>
    </Card>
    </Box>
  </Grid>
  <Grid item>
    <Box>
    <Card sx={{ minWidth: 250, marginTop: '50px',background: 'linear-gradient(to right, #00ff00, #808080)'}}>
      <CardContent>
        <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
          管理员
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {adminNum}个
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate("/adminManagement", { state: { adminId: adminId, permission: permission } })}>查看详情</Button>
      </CardActions>
    </Card>
    </Box>
  </Grid>
  <Grid item>
    <Box>
    <Card sx={{ minWidth: 250, marginTop: '50px',background: 'linear-gradient(to right, red, pink)'}}>
      <CardContent>
        <Typography sx={{ fontSize: 30 }} color="text.primary" gutterBottom>
          评价
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {ratingNum}条
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" >查看详情</Button>
      </CardActions>
    </Card>
    </Box>
  </Grid>
</Grid>
        
<Grid container spacing={30} sx={{ marginTop: '10px'}} >

  <Grid item>
  <h2 >最多评价的电影</h2>
      <Paper>
        <BarChart width={700} height={300} data={mostViewedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="count" fill="#8884d8" />
            <XAxis dataKey="movieName" tick={null}/>
            <YAxis dataKey="count"/>
            <Tooltip />
        </BarChart>
      </Paper>
  </Grid>

  <Grid item>
  <h2 >电影评分分析</h2>
      <Paper>
        <BarChart width={400} height={300} data={scoreDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="number" fill="#FF0000" />
            <XAxis dataKey="scoreInterval" />
            <YAxis dataKey="number"/>
            <Tooltip />
        </BarChart>
      </Paper>
  </Grid>

  <Grid item>
  <h2 >用户年龄分析</h2>
  <Paper >
        <PieChart width={300} height={300}>
          <Pie data={ageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data1.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[(index) % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </Paper>
  </Grid>
</Grid>
      </Box>
    </Box>
        </div>
    )
}

export default Dashboard;