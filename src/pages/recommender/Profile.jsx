import { Box, Paper } from "@mui/material";
import PrimarySearchAppBar from "../../components/PrimarySearchAppBar";

function Profile(){
    return(
        <div>
           <Paper style={{ backgroundColor: '#000000' }}>
             <PrimarySearchAppBar></PrimarySearchAppBar>
          </Paper>
        </div>
    )
}

export default Profile;