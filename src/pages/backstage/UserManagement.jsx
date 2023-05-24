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
import { DataGrid } from '@mui/x-data-grid/DataGrid';
import axios from "axios";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const columns = [
  { field: 'userId', headerName: '用户ID', width: 100 },
  { field: 'username', headerName: '用户名', width: 300 },
  { field: 'email', headerName: '邮箱', width: 300 },
  { field: 'password', headerName: '密码', width: 300,},
  { field: 'deleted',
    headerName: '状态',
    description: '若deleted为0，显示正常；若deleted为1，显示已注销',
    sortable: false,
    width: 200,
    valueGetter: (params) =>(params.row.deleted === 0 ? '正常' : '已注销'),
  },
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


function UserManagement(props){
    const location = useLocation();
    const adminId = location.state.adminId;
    const permission=location.state.permission;

    const [userList, setUserList]=React.useState();//用户列表
    const [isLoading, setIsLoading] = React.useState(true);//由于数据加载慢，则在axios的finally里判断

    /**
     * 用户信息
     */
    const [userId, setUserId]=React.useState(0)
    const [userAvatar,setUserAvatar]=React.useState('') //头像地址
    const [username, setUsername]=React.useState('')
    const [email, setEmail]=React.useState('')
    const [password, setPassword]=React.useState('')
    const [deleted, setDeleted]=React.useState(0)

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

     /**
     * 删除账户
     */
    const handleDelete = () => {
      console.log(selectedRows)
      if (selectedRows.length==0){
        alert("请选中要注销的账户");
        return;
      }
      selectedRows.forEach(i=>{
        console.log(i)
        axios.delete(`http://localhost:8088/user/logic?userId=${i}`).
        then((response) => {
          console.log(response.data);
        });
      })
      window.location.reload(); //页面刷新
    };

    /**
     * 恢复删除的账户
     */
    const handleRecover=()=>{
      console.log(selectedRows)
      if (selectedRows.length==0){
        alert("请选中要恢复的账户");
        return;
      }
      selectedRows.forEach(i=>{
        console.log(i)
        axios.delete(`http://localhost:8088/user/recover?userId=${i}`).
        then((response) => {
          console.log(response.data);
        });
      })
      window.location.reload(); //页面刷新
    }

    //点击更新按钮打开模态框
    const handleClickUpdate=()=>{
      //根据选中的row获得对应的信息
      if (selectedRows.length!=1){
        alert("每次请选择一条数据更新")
        return;
      }
      console.log("选中的row",selectedRows[0])
      //调用API根据adminId获取数据
      axios.get(`http://localhost:8088/user/profile?userId=${selectedRows[0]}`).
        then((response) => {
          if (response.data.code==0){
            setUserId(response.data.data.userId)
            setUsername(response.data.data.username)
            setEmail(response.data.data.email)
            setPassword(response.data.data.password)
            setDeleted(response.data.data.deleted)
            setUserAvatar(response.data.data.avatar)
          }
          else{
            //code为-1
            console.log("没有获取到这个用户")
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
      data.append("userId",userId)
      data.append("username",username)
      data.append("email",email)
      data.append("password",password)
      data.append("avatar",userAvatar)
      data.append("deleted",deleted)

      axios.put("http://localhost:8088/user/profile",data).
      then((response) => {
        console.log(response.data);
    });
      //关闭模态框
      setUpdate(false);
      window.location.reload(); //页面刷新
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
          * 获取用户列表
          */
        axios.get("http://localhost:8088/user/list").
        then((response) => {
          if (response.data.code==0){
            setUserList(response.data.data)
            // console.log("用户列表：",userList);
          }
          else{
            //code为-1
            console.log("没有用户列表")
          }})
          .catch((error)=>{
            console.log("请求出错",error);
          })
          .finally(()=>{
            setIsLoading(false);
          });
       },[userList]);
    

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
            基于协同过滤的视频推荐系统 用户管理
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
          <Button variant="contained" color="success" onClick={handleRecover}>恢复账户</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>注销账户</Button>
          <Button variant="contained" color="secondary" onClick={handleClickUpdate}>更新</Button>
          <Dialog open={update} onClose={handleCloseUpdate}>
             <form onSubmit={handleSubmitUpdate}>
             <DialogTitle>更新用户信息</DialogTitle>
              <DialogContent>
              <TextField
                margin="dense"
                id="userId-update"
                label="用户ID"
                fullWidth
                variant="standard"
                value={userId}
                readOnly
                />
              <TextField
                autoFocus
                margin="dense"
                id="email-update"
                label="邮箱地址"
                type="email"
                fullWidth
                variant="standard"
                value={email}
                onChange={(event)=>setEmail(event.target.value)}
                />
                <TextField
                margin="dense"
                id="username-update"
                label="用户名"
                fullWidth
                variant="standard"
                value={username}
                onChange={(event)=>setUsername(event.target.value)}
                />
                <TextField
                margin="dense"
                id="password-update"
                label="密码"
                fullWidth
                variant="standard"
                value={password}
                onChange={(event)=>setPassword(event.target.value)}
                />
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
          rows={userList}
          columns={columns}
          getRowId={(row) => row.userId}
          initialState={{
          pagination: {
          paginationModel: { page: 0, pageSize: 20 },
        },}}
          pageSizeOptions={[20, 50, 100]}
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

export default UserManagement;