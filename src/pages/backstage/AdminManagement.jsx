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
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert } from '@mui/material';

const columns = [
  { field: 'adminId', headerName: '管理员ID', width: 150 },
  { field: 'adminName', headerName: '管理员名', width: 250 },
  { field: 'email', headerName: '邮箱', width: 250 },
  { field: 'password', headerName: '密码', width: 250,},
  { field: 'permission',
  headerName: '权限',
  description: '若permission为0，显示普通管理员；若permission为1，显示超级管理员',
  sortable: false,
  width: 200,
  valueGetter: (params) =>(params.row.permission === 0 ? '普通管理员' : '超级管理员'),
  },
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


function AdminManagement(props){
    const location = useLocation();
    const adminId = location.state.adminId;
    const permission=location.state.permission;

    const [adminList, setAdminList]=React.useState();//管理员列表
    const [isLoading, setIsLoading] = React.useState(true);//由于数据加载慢，则在axios的finally里判断

    //添加表单
    const [addEmail, setAddEmail]=React.useState("");
    const [addPassword, setAddPassword]=React.useState("")
    const [addAdminName, setAddAdminName]=React.useState("")

    //修改表单
    const [updateId, setUpdateId]=React.useState(0)//不能修改
    const [updateEmail, setUpdateEmail]=React.useState("")
    const [updatePassword, setUpdatePassword]=React.useState("")
    const [updateAdminName, setUpdateAdminName]=React.useState("")
    const [updateAvatar, setUpdateAvatar]=React.useState("")//不显示
    const [updateDeleted, setUpdateDeleted]=React.useState(0)//不显示
    const [updatePermission, setUpdatePermission]=React.useState(0)//不显示

    // //用于更新按钮，判断是否选择row的条数正确，因为每次只能更新一条
    // const [updateSelect, setUpdateSelect]=React.useState(true)

    /**
     * 控制添加按钮
     */
    const [add, setAdd] = React.useState(false);

    /**
     * 控制更新按钮
     */
    const [update, setUpdate]=React.useState(false);

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
      // 在这里执行删除操作，例如与后端通信并从数据库中删除选定的行
      // 删除成功后，更新用户界面，可以重新加载数据或从 adminList 中移除被删除的行
      selectedRows.forEach(i=>{
        console.log(i)
        axios.delete(`http://localhost:8088/admin/logic?adminId=${i}`).
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
      selectedRows.forEach(i=>{
        console.log(i)
        axios.delete(`http://localhost:8088/admin/recover?adminId=${i}`).
        then((response) => {
          console.log(response.data);
        });
      })
      window.location.reload(); //页面刷新
    }

    //点击添加按钮打开模态框
    const handleClickAdd = () => {
      setAdd(true);
    };

    //点击更新按钮打开模态框
    const handleClickUpdate=()=>{
      //根据选中的row获得对应的信息
      if (selectedRows.length!=1){
        // setUpdateSelect(false)
        alert("每次请选择一条数据更新")
        return;
      }
      console.log("选中的row",selectedRows[0])
      //调用API根据adminId获取数据
      axios.get(`http://localhost:8088/admin/adminId?adminId=${selectedRows[0]}`).
        then((response) => {
          if (response.data.code==0){
            setUpdateId(response.data.data.adminId)
            setUpdateEmail(response.data.data.email)
            setUpdateAdminName(response.data.data.adminName)
            setUpdatePassword(response.data.data.password)
            setUpdateAvatar(response.data.data.avatar)
            setUpdateDeleted(response.data.data.deleted)
            setUpdatePermission(response.data.data.permission)
          }
          else{
            //code为-1
            console.log("没有获取到这个管理员")
          }})
      setUpdate(true)
    }
  
    //关闭添加模态框
    const handleCloseAdd = () => {
      setAdd(false);
    };

    //关闭更新模态框
    const handleCloseUpdate=()=>{
      setUpdate(false)
    }

    //添加表单提交
    const handleSubmitAdd=(event)=>{
      event.preventDefault();
      const data = new FormData();
      data.append("email",addEmail)
      data.append("password",addPassword)
      data.append("adminName",addAdminName)
      // console.log("添加表单提交",data);
      axios.post("http://localhost:8088/admin",data).
      then((response) => {
        console.log(response.data);
    });
      //关闭模态框
      setAdd(false);
      window.location.reload(); //页面刷新
    }

    //更新表单提交
    const handleSubmitUpdate=(event)=>{
      event.preventDefault();
      const data = new FormData();
      data.append("adminId",updateId)
      data.append("email",updateEmail)
      data.append("password",updatePassword)
      data.append("adminName",updateAdminName)
      data.append("avatar",updateAvatar)
      data.append("deleted",updateDeleted)
      data.append("permission",updatePermission)
      axios.put("http://localhost:8088/admin",data).
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
          * 获取管理员列表
          */
        axios.get("http://localhost:8088/admin/list").
        then((response) => {
          if (response.data.code==0){
            setAdminList(response.data.data)
            console.log("管理员列表：",adminList);
          }
          else{
            //code为-1
            console.log("没有管理员列表")
          }})
          .catch((error)=>{
            console.log("请求出错",error);
          })
          .finally(()=>{
            setIsLoading(false);
          });
       },[]);
    

    return(
        <div>
           {/* {!updateSelect && (
      <Alert severity="error">每次只能选择一条数据更新</Alert>
      )} */}
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
            基于协同过滤的视频推荐系统 管理员管理
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
          <Button variant="contained" color="success" onClick={handleClickAdd}>添加</Button>
          <Dialog open={add} onClose={handleCloseAdd}>
             <form onSubmit={handleSubmitAdd}>
             <DialogTitle>添加新管理员</DialogTitle>
              <DialogContent>
                  {/* <DialogContentText>
                    添加一个普通管理员，需要输入邮箱、管理员名称、密码。
                  </DialogContentText> */}
              <TextField
                autoFocus
                margin="dense"
                id="email-add"
                label="邮箱地址"
                type="email"
                fullWidth
                variant="standard"
                onChange={(event)=>setAddEmail(event.target.value)}
                />
                <TextField
                margin="dense"
                id="adminName-add"
                label="管理员名称"
                fullWidth
                variant="standard"
                onChange={(event)=>setAddAdminName(event.target.value)}
                />
                <TextField
                margin="dense"
                id="password-add"
                label="密码"
                // type="password"
                fullWidth
                variant="standard"
                onChange={(event)=>setAddPassword(event.target.value)}
                />
            </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAdd}>取消</Button>
                    <Button type='submit'>提交</Button>
                </DialogActions>
             </form>
          </Dialog>
          <Button variant="contained" color="warning" onClick={handleClickUpdate}>更新</Button>
          <Dialog open={update} onClose={handleCloseUpdate}>
             <form onSubmit={handleSubmitUpdate}>
             <DialogTitle>更新管理员信息</DialogTitle>
              <DialogContent>
              <TextField
                margin="dense"
                id="adminId-update"
                label="管理员ID"
                fullWidth
                variant="standard"
                value={updateId}
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
                value={updateEmail}
                onChange={(event)=>setUpdateEmail(event.target.value)}
                />
                <TextField
                margin="dense"
                id="adminName-update"
                label="管理员名称"
                fullWidth
                variant="standard"
                value={updateAdminName}
                onChange={(event)=>setUpdateAdminName(event.target.value)}
                />
                <TextField
                margin="dense"
                id="password-update"
                label="密码"
                // type="password"
                fullWidth
                variant="standard"
                value={updatePassword}
                onChange={(event)=>setUpdatePassword(event.target.value)}
                />
            </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUpdate}>取消</Button>
                    <Button type='submit'>提交</Button>
                </DialogActions>
             </form>
          </Dialog>
          <Button variant="contained" color="error" onClick={handleDelete}>停用账户</Button>
          <Button variant="contained" color="secondary" onClick={handleRecover}>恢复账户</Button>
        </Stack>
        <br/>
      <DataGrid
          rows={adminList}
          columns={columns}
          getRowId={(row) => row.adminId}
          initialState={{
          pagination: {
          paginationModel: { page: 0, pageSize: 10 },
        },}}
          pageSizeOptions={[10,20,50]}
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

export default AdminManagement;